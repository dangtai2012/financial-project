import { EAuth } from '@common/constants/enums';
import {
  Auth,
  CurrentUser,
  ResponseMessage,
  Serialize,
} from '@common/decorators';
import { ApiErrorResponse, ApiSuccessResponse } from '@common/dtos/responses';
import { IJwtPayload } from '@common/interfaces/auth';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
} from './dtos/requests';
import {
  CreateTransactionResponseDto,
  UpdateTransactionResponseDto,
} from './dtos/responses';
import { TransactionService } from './transaction.service';

@ApiTags('Transaction')
@ApiBearerAuth()
@Auth(EAuth.IS_PRIVATE)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // #region createTransaction
  /**
   * : Create a new transaction
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(CreateTransactionResponseDto)
  @Serialize(CreateTransactionResponseDto)
  @ResponseMessage('Transaction created successfully')
  @HttpCode(HttpStatus.CREATED)
  @Post('create_transaction')
  async createTransaction(
    @CurrentUser() currentUser: IJwtPayload,
    @Body() createTransactionRequestDto: CreateTransactionRequestDto,
  ) {
    return await this.transactionService.createTransaction(
      currentUser,
      createTransactionRequestDto,
    );
  }
  // #endregion

  // #region updateTransaction
  /**
   * : Update an existing transaction
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(UpdateTransactionResponseDto)
  @Serialize(UpdateTransactionResponseDto)
  @ResponseMessage('Transaction updated successfully')
  @HttpCode(HttpStatus.OK)
  @Patch('update_transaction/:transaction_id')
  async updateTransaction(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('transaction_id') transactionId: string,
    @Body() updateTransactionRequestDto: UpdateTransactionRequestDto,
  ) {
    return await this.transactionService.updateTransaction(
      currentUser,
      transactionId,
      updateTransactionRequestDto,
    );
  }
  // #endregion

  // #region deleteTransaction
  /**
   * : Delete a transaction
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(Object)
  @ResponseMessage('Transaction deleted successfully')
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('delete_transaction/:transaction_id')
  async deleteTransaction(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('transaction_id') transactionId: string,
  ) {
    return await this.transactionService.deleteTransaction(
      currentUser,
      transactionId,
    );
  }
  // #endregion
}
