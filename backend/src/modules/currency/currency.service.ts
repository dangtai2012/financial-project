import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  findAll() {
    return `This action returns all currency`;
  }

  findOne(id: number) {
    return `This action returns a #${id} currency`;
  }

  // update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
  //   return `This action updates a #${id} currency`;
  // }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}
