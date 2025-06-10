import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmBaseRepository } from 'src/common/repositories';
import { WalletEntity } from 'src/database/entities';
import { Repository } from 'typeorm';

export class WalletRepository extends TypeOrmBaseRepository<WalletEntity> {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {
    super(walletRepository);
  }

  // #region queryWallets
  /**
   * : Query wallets
   */
  async queryWallets() {
    return this.walletRepository
      .createQueryBuilder('wallets')
      .select([
        'wallets.id',
        'wallets.walletName',
        'wallets.walletType',
        'wallets.balance',
        'wallets.initialBalance',
        'wallets.createdAt',
      ])
      .leftJoin('wallets.currencyId', 'currency')
      .addSelect(['currency.id', 'currency.name', 'currency.symbol'])
      .leftJoin('wallets.userId', 'user')
      .addSelect(['user.id', 'user.name', 'user.email']);
  }
  // #endregion

  // #region removeWallet
  /**
   * : Remove a wallet
   */
  async removeWallet(id: string) {
    return this.walletRepository.delete({ id });
  }
  // #endregion
}
