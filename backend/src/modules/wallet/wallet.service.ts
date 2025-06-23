import {
  ECategoryNameDefault,
  EEntityPrefix,
  ETypeCategory,
} from '@common/constants/enums';
import { IJwtPayload } from '@common/interfaces/auth';
import { CurrencyEntity } from '@database/entities';
import { CategoryRepository } from '@modules/category/category.repository';
import { CurrencyRepository } from '@modules/currency/currency.repository';
import { TransactionRepository } from '@modules/transaction/transaction.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IdGeneratorService } from '@shared/id_generator/id_generator.service';
import Decimal from 'decimal.js';
import { DataSource } from 'typeorm';
import {
  CreateWalletRequestDto,
  UpdateWalletRequestDto,
} from './dtos/requests';
import { WalletRepository } from './wallet.repository';

@Injectable()
export class WalletService {
  constructor(
    /**
     * : Repositories
     */
    private readonly walletRepo: WalletRepository,
    private readonly currencyRepo: CurrencyRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly transactionRepo: TransactionRepository,

    /*end*/

    /**
     * : Services
     */
    private readonly idGeneratorService: IdGeneratorService,
    /*end*/

    private readonly dataSource: DataSource,
  ) {}

  // #region createWallet
  /**
   * : Create a new wallet
   */
  async createWallet(
    currentUser: IJwtPayload,
    createWalletRequestDto: CreateWalletRequestDto,
  ) {
    const { sub: userId } = currentUser;
    const { wltName, currencyId, wltBalance, wltType } = createWalletRequestDto;

    // Start a transaction to ensure wallet and transaction creation is atomic
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingCurrency =
        await this.currencyRepo.existsCurrencyById(currencyId);

      if (!existingCurrency) {
        throw new NotFoundException(`Currency "${currencyId}" does not exist.`);
      }

      const existingWallet = await this.walletRepo.existsWalletByNameAndUserId(
        wltName,
        userId,
      );

      if (existingWallet) {
        throw new NotFoundException(`Wallet "${wltName}" already exists.`);
      }

      const wltId = await this.idGeneratorService.generate(
        EEntityPrefix.WALLET,
      );

      const wallet = this.walletRepo.create({
        id: wltId,
        wltName,
        wltType,
        wltBalance,
        userId: { id: userId },
        currencyId: { id: currencyId },
      });

      const savedWallet = await queryRunner.manager.save(wallet);

      // Only create a transaction if the initial balance is greater than 0
      if (wltBalance > 0) {
        // Find the default income category
        const defaultIncomeCategory = await this.categoryRepo.findOne({
          where: {
            catName: ECategoryNameDefault.OTHER_INCOME,
            isDefault: true,
          },
        });

        if (defaultIncomeCategory) {
          // Create a transaction for the initial balance
          const transactionId = await this.idGeneratorService.generate(
            EEntityPrefix.TRANSACTION,
          );

          const transaction = this.transactionRepo.create({
            id: transactionId,
            trxAmount: wltBalance,
            trxType: ETypeCategory.INCOME,
            trxDate: new Date(),
            trxDescription: `Initial balance for wallet: ${wltName}`,
            categoryId: { id: defaultIncomeCategory.id },
            walletId: { id: savedWallet.id },
          });

          await queryRunner.manager.save(transaction);
        }
      }

      await queryRunner.commitTransaction();
      return savedWallet;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  // #endregion

  // #region getAllWalletByUserId
  /**
   * : Get all wallet by user ID
   */
  async getAllWalletByUserId(curentUser: IJwtPayload) {
    const { sub: userId } = curentUser;

    return await this.walletRepo.find({
      where: {
        userId: { id: userId },
      },
      relations: ['currencyId', 'userId'],
      select: {
        id: true,
        wltName: true,
        wltType: true,
        wltBalance: true,
        currencyId: {
          id: true,
          curName: true,
          curSymbol: true,
        },
        userId: {
          id: true,
          usrName: true,
          usrEmail: true,
        },
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
    });
  }
  //#endregion

  // #region updateWallet
  /**
   * : Update a wallet
   */
  async updateWallet(
    currentUser: IJwtPayload,
    walletId: string,
    updateWalletRequestDto: UpdateWalletRequestDto,
  ) {
    const { sub: userId } = currentUser;
    const { wltName, currencyId, wltBalance } = updateWalletRequestDto;

    // Start a transaction to ensure wallet and transaction updates are atomic.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the existing wallet with relations
      const existingWallet = await this.walletRepo.findOne({
        where: { id: walletId, userId: { id: userId } },
        relations: ['currencyId'],
      });

      // Check if the wallet exists
      if (!existingWallet) {
        throw new NotFoundException(`Wallet does not exist`);
      }

      // Update wallet name if provided
      if (wltName) existingWallet.wltName = wltName;

      // Handle balance changes and create transaction if needed
      if (
        wltBalance !== undefined &&
        wltBalance !== existingWallet.wltBalance
      ) {
        const balanceDifference = new Decimal(wltBalance).minus(
          existingWallet.wltBalance,
        );

        // Update wallet balance
        existingWallet.wltBalance = wltBalance;

        // Create transaction for balance adjustment
        if (!balanceDifference.isZero()) {
          // Find appropriate default category based on transaction type
          const defaultCategoryName = balanceDifference.isNegative()
            ? ECategoryNameDefault.OTHER_EXPENSE
            : ECategoryNameDefault.OTHER_INCOME;

          const defaultCategory = await this.categoryRepo.findOne({
            where: {
              catName: defaultCategoryName,
              isDefault: true,
            },
          });

          if (defaultCategory) {
            const transactionId = await this.idGeneratorService.generate(
              EEntityPrefix.TRANSACTION,
            );

            const transaction = this.transactionRepo.create({
              id: transactionId,
              trxAmount: balanceDifference.abs().toNumber(),
              trxType: balanceDifference.isNegative()
                ? ETypeCategory.EXPENSE
                : ETypeCategory.INCOME,
              trxDate: new Date(),
              trxDescription: `Manual balance adjustment for wallet: ${existingWallet.wltName}`,
              categoryId: { id: defaultCategory.id },
              walletId: { id: existingWallet.id },
            });

            await queryRunner.manager.save(transaction);
          }
        }
      }

      // Update currency if provided
      if (currencyId) {
        const existingCurrency =
          await this.currencyRepo.existsCurrencyById(currencyId);

        if (!existingCurrency) {
          throw new NotFoundException(
            `Currency "${currencyId}" does not exist.`,
          );
        }

        existingWallet.currencyId = { id: currencyId } as CurrencyEntity;
      }

      // Save the updated wallet
      const savedWallet = await queryRunner.manager.save(existingWallet);
      await queryRunner.commitTransaction();

      return savedWallet;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  // #endregion

  // #region deleteWallet
  /**
   * : Delete a wallet
   */
  async deleteWallet(wallet_id: string) {
    const existingWallet = await this.walletRepo.findOne({
      where: { id: wallet_id },
    });

    if (!existingWallet) {
      throw new NotFoundException(`Wallet does not exist`);
    }

    const result = await this.walletRepo.removeWallet(existingWallet.id);

    if (!result.affected) {
      throw new NotFoundException(`Failed to delete wallet`);
    }

    return {};
  }
  // #endregion
}
