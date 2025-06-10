import { SearchRequestDto } from '@common/dtos/requests';
import { IJwtPayload } from '@common/interfaces/auth';
import { CurrencyRepository } from '@modules/currency/currency.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateWalletRequestDto,
  UpdateWalletRequestDto,
} from './dtos/requests';
import { WalletRepository } from './wallet.repository';
import { WalletEntity } from '@database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    /**
     * : Repositories
     */
    private readonly walletRepo: WalletRepository,
    private readonly currencyRepo: CurrencyRepository,

    /*end*/
  ) {}

  // #region createWallet
  /**
   * : Create a new wallet
   */
  async createWallet(
    currentUser: IJwtPayload,
    createWalletRequestDto: CreateWalletRequestDto,
  ) {
    const { walletName, currencyId, initialBalance, walletType } =
      createWalletRequestDto;

    const existingCurrency = await this.currencyRepo.existsById(currencyId);

    if (!existingCurrency) {
      throw new NotFoundException(`Currency "${currencyId}" does not exist.`);
    }

    const wallet = this.walletRepo.create({
      walletName,
      walletType,
      balance: initialBalance,
      initialBalance,
      userId: { id: currentUser.sub },
      currencyId: { id: currencyId },
    });

    return await this.walletRepo.save(wallet);
  }
  // #endregion

  // #region getPaginatedWallets
  /**
   * : Get paginated wallets
   */
  async getPaginatedWallets(
    curentUser: IJwtPayload,
    searchRequestDto: SearchRequestDto<WalletEntity>,
  ) {
    const { sub: userId } = curentUser;
    const { orderBy } = searchRequestDto;

    const wallets = await this.walletRepo.searchForEntity(
      searchRequestDto,
      [orderBy!],
      {
        where: {
          userId: { id: userId },
        },
        relations: ['currencyId', 'userId'],
        select: {
          id: true,
          walletName: true,
          walletType: true,
          balance: true,
          initialBalance: true,
          createdAt: true,
          currencyId: {
            id: true,
            name: true,
            symbol: true,
          },
          userId: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    );

    return wallets;
  }
  //#endregion

  // #region updateWallet
  /**
   * : Update a wallet
   */
  // async updateWallet(
  //   currentUser: IJwtPayload,
  //   updateWalletRequestDto: UpdateWalletRequestDto,
  // ) {
  //   const { id, walletName, initialBalance } = updateWalletRequestDto;

  //   const existingWallet = await this.walletRepo.findOne({
  //     where: { id, userId: { id: currentUser.sub } },
  //     relations: ['currencyId', 'userId'],
  //   });

  //   if (!existingWallet) {
  //     throw new NotFoundException(`Wallet with ID "${id}" does not exist.`);
  //   }

  //   existingWallet.walletName = walletName;
  //   existingWallet.initialBalance = initialBalance;

  //   return await this.walletRepo.save(existingWallet);
  // }
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
      throw new NotFoundException(`Wallet does not exist.`);
    }

    const result = await this.walletRepo.removeWallet(existingWallet.id);

    if (!result.affected) {
      throw new NotFoundException(`Failed to delete wallet".`);
    }

    return {};
  }
  // #endregion
}
