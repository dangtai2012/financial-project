import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { TypeOrmBaseEntity } from './typeorm_base.entity';
import { WalletEntity } from './wallet.entity';

@Entity({ name: 'transactions' })
export class TransactionEntity extends TypeOrmBaseEntity {
  @Column({
    name: 'trx_amount',
    type: 'decimal',
    precision: 20,
    scale: 2,
    comment: 'Transaction amount',
  })
  trxAmount: number;

  @Column({
    name: 'trx_type',
    type: 'varchar',
    length: 50,
    comment: 'Transaction type (expense, income)',
  })
  trxType: string;

  @Column({ name: 'trx_date', type: 'date', comment: 'Transaction date' })
  trxDate: Date;

  @Column({
    name: 'trx_description',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Transaction description',
  })
  trxDescription: string | null;

  //#region Relations
  //: ManyToOne
  @ManyToOne(() => WalletEntity, (wallet) => wallet.transactions)
  @JoinColumn({
    name: 'wallet_id',
    referencedColumnName: 'id',
  })
  walletId: WalletEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.transactions, {
    nullable: true,
  })
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  categoryId: CategoryEntity | null;
  //#endregion
}
