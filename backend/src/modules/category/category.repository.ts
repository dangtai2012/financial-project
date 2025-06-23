import { TypeOrmBaseRepository } from '@common/repositories';
import { CategoryEntity } from '@database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class CategoryRepository extends TypeOrmBaseRepository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categorytRepository: Repository<CategoryEntity>,
  ) {
    super(categorytRepository);
  }
}
