import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyService.remove(+id);
  }
}
