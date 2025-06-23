import { forwardRef, Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletEntity } from '@database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRepository } from './wallet.repository';
import { CurrencyModule } from '@modules/currency/currency.module';
import { TransactionModule } from '@modules/transaction/transaction.module';
import { CategoryModule } from '@modules/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity]),
    CurrencyModule,
    CategoryModule,
    forwardRef(() => TransactionModule),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository],
  exports: [WalletService, WalletRepository],
})
export class WalletModule {}
