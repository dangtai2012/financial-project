import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletEntity } from '@database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRepository } from './wallet.repository';
import { CurrencyModule } from '@modules/currency/currency.module';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity]), CurrencyModule],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository],
})
export class WalletModule {}
