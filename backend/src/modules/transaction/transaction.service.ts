import { EEntityPrefix, ETypeCategory } from '@common/constants/enums';
import { IJwtPayload } from '@common/interfaces/auth';
import { TransactionEntity } from '@database/entities';
import { CategoryRepository } from '@modules/category/category.repository';
import { WalletRepository } from '@modules/wallet/wallet.repository';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Decimal from 'decimal.js';
import { DataSource } from 'typeorm';
import {
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
} from './dtos/requests';
import { TransactionRepository } from './transaction.repository';
import { IdGeneratorService } from '@shared/id_generator/id_generator.service';

@Injectable()
export class TransactionService {
  constructor(
    /**
     * : Repositories
     */

    private readonly transactionRepo: TransactionRepository,
    private readonly walletRepo: WalletRepository,
    private readonly categoryRepo: CategoryRepository,
    /*end*/

    /**
     * Services
     */
    private readonly idGeneratorService: IdGeneratorService,
    /*end*/
    private readonly dataSource: DataSource,
  ) {}

  // #region createTransaction
  /**
   * : Create a new transaction
   */
  async createTransaction(
    currentUser: IJwtPayload,
    createTransactionRequestDto: CreateTransactionRequestDto,
  ) {
    const { sub: userId } = currentUser;
    const { walletId, categoryId, trxAmount, trxDate, trxDescription } =
      createTransactionRequestDto;

    // Start a transaction to ensure wallet balance update is atomic
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate wallet exists and belongs to user
      const walletOfUser = await this.walletRepo.findOne({
        where: {
          id: walletId,
          userId: { id: userId },
        },
      });

      if (!walletOfUser) {
        throw new NotFoundException(
          `Wallet not found or does not belong to you`,
        );
      }

      // Validate category exists and belongs to user or is default
      const categoryOfUser = await this.categoryRepo.findOne({
        where: [
          {
            id: categoryId,
            userId: { id: userId },
          },
          { id: categoryId, isDefault: true },
        ],
      });

      if (!categoryOfUser) {
        throw new NotFoundException(
          `Category not found or does not belong to the wallet`,
        );
      }

      if (trxAmount < 0 && categoryOfUser.catType !== ETypeCategory.EXPENSE) {
        throw new BadRequestException(
          'Amount must be positive for income transactions',
        );
      }

      if (trxAmount > 0 && categoryOfUser.catType !== ETypeCategory.INCOME) {
        throw new BadRequestException(
          'Amount must be negative for expense transactions',
        );
      }

      if (trxAmount === 0) {
        throw new BadRequestException('Amount must not be zero');
      }

      // Update wallet balance based on transaction type
      const currentBalance = new Decimal(walletOfUser.wltBalance);
      const transactionAmount = new Decimal(trxAmount);

      if (transactionAmount.lessThan(0)) {
        if (currentBalance.lessThan(transactionAmount.abs())) {
          throw new BadRequestException(
            'Insufficient wallet balance for this expense',
          );
        }
        walletOfUser.wltBalance = currentBalance
          .minus(transactionAmount.abs())
          .toNumber();
      } else if (transactionAmount.greaterThan(0)) {
        walletOfUser.wltBalance = currentBalance
          .plus(transactionAmount)
          .toNumber();
      }

      const transactionId = await this.idGeneratorService.generate(
        EEntityPrefix.TRANSACTION,
      );

      // Create transaction entity
      const transaction = this.transactionRepo.create({
        id: transactionId,
        trxAmount: transactionAmount.abs().toNumber(),
        trxType: transactionAmount.lessThan(0)
          ? ETypeCategory.EXPENSE
          : ETypeCategory.INCOME,
        trxDate,
        trxDescription,
        categoryId: { id: categoryId },
        walletId: { id: walletId },
      });

      // Save wallet with updated balance
      await queryRunner.manager.save(walletOfUser);

      // Save transaction
      const savedTransaction = await queryRunner.manager.save(transaction);

      // Load the transaction with relations if needed
      const completeTransaction = await queryRunner.manager.findOne(
        TransactionEntity,
        {
          where: { id: savedTransaction.id },
          relations: ['walletId', 'categoryId'],
        },
      );

      // Commit the transaction
      await queryRunner.commitTransaction();

      return completeTransaction;
    } catch (error) {
      // Rollback in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
  // #endregion

  // #region updateTransaction
  /**
   * : Update an existing transaction
   */
  async updateTransaction(
    currentUser: IJwtPayload,
    transactionId: string,
    updateTransactionRequestDto: UpdateTransactionRequestDto,
  ) {
    const { sub: userId } = currentUser;
    const { categoryId, trxAmount, trxDate, trxDescription } =
      updateTransactionRequestDto;

    // Start a transaction to ensure wallet balance update is atomic
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the existing transaction with relations
      const existingTransaction = await this.transactionRepo.findOne({
        where: { id: transactionId },
        relations: ['walletId', 'categoryId'],
      });

      if (!existingTransaction) {
        throw new NotFoundException(`Transaction not found`);
      }

      // Verify the transaction belongs to a wallet owned by the user
      const walletOfExistingTransaction = await this.walletRepo.findOne({
        where: {
          id: existingTransaction.walletId.id,
          userId: { id: userId },
        },
      });

      if (!walletOfExistingTransaction) {
        throw new NotFoundException(
          `Transaction not found or does not belong to any of your wallets`,
        );
      }

      // category can null, so if have category verify, if null just update
      if (categoryId) {
        const categoryOfUser = await this.categoryRepo.findOne({
          where: [
            {
              id: categoryId,
              userId: { id: userId },
            },
            { id: categoryId, isDefault: true },
          ],
        });

        if (!categoryOfUser) {
          throw new NotFoundException(
            `Category not found or does not belong to the wallet`,
          );
        }

        if (trxAmount < 0 && categoryOfUser.catType !== ETypeCategory.EXPENSE) {
          throw new BadRequestException(
            'Amount must be positive for income transactions',
          );
        }

        if (trxAmount > 0 && categoryOfUser.catType !== ETypeCategory.INCOME) {
          throw new BadRequestException(
            'Amount must be negative for expense transactions',
          );
        }

        if (trxAmount === 0) {
          throw new BadRequestException('Amount must not be zero');
        }
      }

      // Reverse the old transaction effect on wallet balance
      let currentBalance = new Decimal(walletOfExistingTransaction.wltBalance);
      const oldTransactionAmount = new Decimal(existingTransaction.trxAmount);
      const newTransactionAmount = new Decimal(trxAmount);

      if (existingTransaction.trxType === ETypeCategory.EXPENSE) {
        currentBalance = currentBalance.plus(oldTransactionAmount);
      } else if (existingTransaction.trxType === ETypeCategory.INCOME) {
        currentBalance = currentBalance.minus(oldTransactionAmount);
      }

      // Update wallet balance based on new transaction type
      if (newTransactionAmount.lessThan(0)) {
        if (
          walletOfExistingTransaction.wltBalance <
          newTransactionAmount.abs().toNumber()
        ) {
          throw new BadRequestException(
            'Insufficient wallet balance for this expense',
          );
        }
        walletOfExistingTransaction.wltBalance = currentBalance
          .minus(newTransactionAmount.abs())
          .toNumber();
      } else if (newTransactionAmount.greaterThan(0)) {
        walletOfExistingTransaction.wltBalance = currentBalance
          .plus(newTransactionAmount)
          .toNumber();
      }

      // Save wallet with updated balance
      await queryRunner.manager.save(walletOfExistingTransaction);

      // Update the transaction entity
      await queryRunner.manager.update(
        TransactionEntity,
        { id: transactionId },
        {
          trxAmount: newTransactionAmount.abs().toNumber(),
          trxType: newTransactionAmount.lessThan(0)
            ? ETypeCategory.EXPENSE
            : ETypeCategory.INCOME,
          trxDate,
          trxDescription,
          categoryId: categoryId ? { id: categoryId } : null,
        },
      );

      // Load the transaction with relations if needed
      const completeTransaction = await queryRunner.manager.findOne(
        TransactionEntity,
        {
          where: { id: transactionId },
          relations: ['walletId', 'categoryId'],
        },
      );

      // Commit the transaction
      await queryRunner.commitTransaction();

      return completeTransaction;
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  // #endregion

  // #region deleteTransaction
  /**
   * : Delete a transaction
   */
  async deleteTransaction(currentUser: IJwtPayload, transactionId: string) {
    const { sub: userId } = currentUser;

    // Start a transaction to ensure wallet balance update is atomic
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the existing transaction with relations
      const existingTransaction = await this.transactionRepo.findOne({
        where: { id: transactionId },
        relations: ['walletId', 'categoryId'],
      });

      if (!existingTransaction) {
        throw new NotFoundException(`Transaction not found`);
      }

      // Verify the transaction belongs to a wallet owned by the user
      const walletOfExistingTransaction = await this.walletRepo.findOne({
        where: {
          id: existingTransaction.walletId.id,
          userId: { id: userId },
        },
      });

      if (!walletOfExistingTransaction) {
        throw new NotFoundException(
          `Transaction not found or does not belong to any of your wallets`,
        );
      }

      // Reverse the transaction effect on wallet balance
      const currentBalance = new Decimal(
        walletOfExistingTransaction.wltBalance,
      );
      const transactionAmount = new Decimal(existingTransaction.trxAmount);

      if (existingTransaction.trxType === ETypeCategory.EXPENSE) {
        walletOfExistingTransaction.wltBalance = currentBalance
          .plus(transactionAmount)
          .toNumber();
      } else if (existingTransaction.trxType === ETypeCategory.INCOME) {
        walletOfExistingTransaction.wltBalance = currentBalance
          .minus(transactionAmount)
          .toNumber();
      }

      // Save wallet with updated balance
      await queryRunner.manager.save(walletOfExistingTransaction);

      // Delete the transaction
      await queryRunner.manager.delete(TransactionEntity, {
        id: transactionId,
      });

      // Commit transaction
      await queryRunner.commitTransaction();

      return {};
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
  // #endregion
}
