import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CurrencyEntity, TransactionEntity, UserEntity } from '.';
import { TypeOrmBaseEntity } from './typeorm_base.entity';

@Entity({ name: 'wallets' })
export class WalletEntity extends TypeOrmBaseEntity {
  @Column({
    name: 'wlt_name',
    type: 'varchar',
    length: 100,
    comment: 'Wallet name',
  })
  wltName: string;

  @Column({
    name: 'wlt_type',
    type: 'varchar',
    length: 10,
    comment: 'Wallet type (e.g. cash, bank, credit card, etc.)',
  })
  wltType: string;

  @Column({
    name: 'wlt_balance',
    type: 'decimal',
    precision: 20,
    scale: 2,
    comment: 'Wallet balance',
  })
  wltBalance: number;

  //#region Relations
  //: OneToMany
  @OneToMany(() => TransactionEntity, (transaction) => transaction.walletId)
  transactions: TransactionEntity[];

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
