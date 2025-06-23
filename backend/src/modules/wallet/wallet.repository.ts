import { TypeOrmBaseRepository } from '@common/repositories';
import { WalletEntity } from '@database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class WalletRepository extends TypeOrmBaseRepository<WalletEntity> {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {
    super(walletRepository);
  }

  // #region existsWalletByNameAndUserId
  /**
   * : Check if a wallet exists by its name and user ID
   */
  async existsWalletByNameAndUserId(wltName: string, userId: string) {
    return await this.walletRepository.existsBy({
      wltName,
      userId: { id: userId },
    });
  }
  // #endregion

  // #region removeWallet
  /**
   * : Remove a wallet by its ID
   */
  async removeWallet(id: string) {
    return this.walletRepository.delete({ id });
  }
  // #endregion
}
