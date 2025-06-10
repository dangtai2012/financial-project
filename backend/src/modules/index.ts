import { AuthModule } from './auth/auth.module';
import { CurrencyModule } from './currency/currency.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

export const modules = [AuthModule, UserModule, WalletModule, CurrencyModule];
export { AuthModule, UserModule, WalletModule, CurrencyModule };
