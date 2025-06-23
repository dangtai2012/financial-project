import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CurrencyModule } from './currency/currency.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

export const modules = [
  AuthModule,
  UserModule,
  WalletModule,
  CurrencyModule,
  CategoryModule,
  TransactionModule,
];
export {
  AuthModule,
  UserModule,
  WalletModule,
  CurrencyModule,
  CategoryModule,
  TransactionModule,
};
