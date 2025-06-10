import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CurrencyEntity, UserEntity } from '.';
import { TypeOrmBaseEntity } from './typeorm_base.entity';

@Entity({ name: 'wallets' })
export class WalletEntity extends TypeOrmBaseEntity {
  @Column({ name: 'wallet_name', type: 'varchar', length: 100 })
  walletName: string;

  @Column({ name: 'wallet_type', type: 'varchar', length: 10 })
  walletType: string;

  @Column({ name: 'balance', type: 'decimal', precision: 20, scale: 2 })
  balance: number;

  @Column({ name: 'initial_balance', type: 'decimal', precision: 20, scale: 2 })
  initialBalance: number;

  //#region Relations
  //: ManyToOne

  @ManyToOne(() => CurrencyEntity, (currency) => currency.id)
  @JoinColumn({
    name: 'currency_id',
    referencedColumnName: 'id',
  })
  currencyId: CurrencyEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  userId: UserEntity;
  //#endregion
}
