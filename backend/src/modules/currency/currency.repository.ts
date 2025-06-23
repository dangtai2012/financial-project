import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyEntity } from 'src/database/entities';
import { Repository } from 'typeorm';

export class CurrencyRepository {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
  ) {}

  // #region existsCurrencyById
  /**
   *: Check if a currency exists by its ID
   */
  async existsCurrencyById(id: string): Promise<boolean> {
    return await this.currencyRepository.existsBy({
      id,
    });
  }
  // #endregion
}
