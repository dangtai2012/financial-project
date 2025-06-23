import { TypeOrmBaseRepository } from '@common/repositories';
import { TransactionEntity } from '@database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionRepository extends TypeOrmBaseRepository<TransactionEntity> {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {
    super(transactionRepository);
  }
}
