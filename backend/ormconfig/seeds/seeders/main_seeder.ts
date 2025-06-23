import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { ETypeCategory } from '../../../src/common/constants/enums/category.enum';
import {
  CategoryEntity,
  CurrencyEntity,
  UserEntity,
} from '../../../src/database/entities';
import * as seedData from '../data/seed-data.json';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await dataSource.query(`TRUNCATE TABLE users CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE currencies CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE categories CASCADE;`);

    // Seed users
    const userRepository = dataSource.getRepository(UserEntity);
    for (const userData of seedData.users) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = userRepository.create({
        id: `USR-${Date.now()}-001`,
        usrName: userData.name,
        usrEmail: userData.email,
        usrPassword: hashedPassword,
        isVerified: userData.isVerified,
      });
      await userRepository.save(user);
    }

    // Seed currencies
    const currencyRepository = dataSource.getRepository(CurrencyEntity);
    for (const currencyData of seedData.currencies) {
      const currency = currencyRepository.create({
        id: currencyData.id,
        curName: currencyData.name,
        curSymbol: currencyData.symbol,
      });
      await currencyRepository.save(currency);
    }

    // Seed categories
    const categoryRepository = dataSource.getRepository(CategoryEntity);
    for (const categoryData of seedData.categories) {
      const category = categoryRepository.create({
        id: `CAT-${Date.now()}-001`,
        catName: categoryData.name,
        catType: categoryData.type as ETypeCategory,
        isDefault: categoryData.isDefault,
      });
      await categoryRepository.save(category);
    }
  }
}
