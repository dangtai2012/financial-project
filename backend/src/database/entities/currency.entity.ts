import { Column, Entity, OneToMany } from 'typeorm';
import { WalletEntity } from './wallet.entity';

@Entity({ name: 'currencies' })
export class CurrencyEntity {
  @Column({
    name: 'id',
    type: 'char',
    length: 3,
    primary: true,
    comment: 'Currency code',
  })
  id: string;

  @Column({
    name: 'cur_name',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'Currency name',
  })
  curName: string;

  @Column({
    name: 'cur_symbol',
    type: 'varchar',
    length: 10,
    comment: 'Currency symbol',
  })
  curSymbol: string;

  //#region Relations
  //: OneToMany
  @OneToMany(() => WalletEntity, (wallet) => wallet.currencyId)
  wallets: WalletEntity[];
  //#endregion
}
