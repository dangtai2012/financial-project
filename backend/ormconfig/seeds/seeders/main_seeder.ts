import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CurrencyEntity, UserEntity } from '../../../src/database/entities';

const CURRENCY_DATA = [
  { id: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { id: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { id: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { id: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { id: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { id: 'GBP', name: 'British Pound Sterling', symbol: '£' },
  { id: 'EUR', name: 'Euro', symbol: '€' },
  { id: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { id: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { id: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { id: 'USD', name: 'United States Dollar', symbol: '$' },
  { id: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { id: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { id: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { id: 'ARS', name: 'Argentine Peso', symbol: '$' },
  { id: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { id: 'NZD', name: 'New Zealand Dollar', symbol: '$' },
  { id: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K' },
  { id: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { id: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
];

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await dataSource.query(`TRUNCATE TABLE users CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE currencies CASCADE;`);

    await factoryManager.get(UserEntity).save();

    const currencyRepository = dataSource.getRepository(CurrencyEntity);

    for (const currencyData of CURRENCY_DATA) {
      const currency = currencyRepository.create({
        id: currencyData.id,
        name: currencyData.name,
        symbol: currencyData.symbol,
      });
      await currencyRepository.save(currency);
    }
  }
}
