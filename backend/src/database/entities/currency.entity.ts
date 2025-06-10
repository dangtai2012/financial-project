import { Column, Entity, OneToMany } from 'typeorm';
import { WalletEntity } from './wallet.entity';

@Entity({ name: 'currencies' })
export class CurrencyEntity {
  @Column({
    name: 'id',
    type: 'char',
    length: 3,
    primary: true,
  })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ name: 'symbol', type: 'varchar', length: 10 })
  symbol: string;

  //#region Relations
  //: OneToMany

  @OneToMany(() => WalletEntity, (wallet) => wallet.currencyId)
  wallets: WalletEntity[];
  //#endregion
}
