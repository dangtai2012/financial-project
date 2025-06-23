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
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateWalletRequestDto,
  UpdateWalletRequestDto,
} from './dtos/requests';
import {
  CreateWalletResponseDto,
  GetAllWalletResponseDto,
  UpdateWalletResponseDto,
} from './dtos/responses';
import { WalletService } from './wallet.service';

@ApiBearerAuth()
@Auth(EAuth.IS_PRIVATE)
@Controller('wallet')
export class WalletController {
  constructor(
    /**
     * : Services
     */
    private readonly walletService: WalletService,
    /*end*/
  ) {}

  // #region createWallet
  /**
   * : Create a new wallet
   */

  @ApiErrorResponse()
  @ApiSuccessResponse(CreateWalletResponseDto)
  @Serialize(CreateWalletResponseDto)
  @ResponseMessage('Wallet created successfully')
  @HttpCode(HttpStatus.CREATED)
  @Post('create_wallet')
  async createWallet(
    @CurrentUser() currentUser: IJwtPayload,
    @Body() createWalletRequestDto: CreateWalletRequestDto,
  ) {
    return this.walletService.createWallet(currentUser, createWalletRequestDto);
  }
  // #endregion

  // #region  getAllWalletByUserId
  /**
   * : Get all wallet by user ID
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(GetAllWalletResponseDto)
  @Serialize(GetAllWalletResponseDto)
  @ResponseMessage('Wallets retrieved successfully')
  @HttpCode(HttpStatus.OK)
  @Get('get_all_wallet')
  async getAllWalletByUserId(@CurrentUser() currentUser: IJwtPayload) {
    return await this.walletService.getAllWalletByUserId(currentUser);
  }
  // #endregion

  // #region updateWallet
  /**
   * : Update a wallet
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(UpdateWalletResponseDto)
  @Serialize(UpdateWalletResponseDto)
  @ResponseMessage('Wallet updated successfully')
  @HttpCode(HttpStatus.OK)
  @Patch('update_wallet/:wallet_id')
  async updateWallet(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('wallet_id') walletId: string,
    @Body() updateWalletRequestDto: UpdateWalletRequestDto,
  ) {
    return await this.walletService.updateWallet(
      currentUser,
      walletId,
      updateWalletRequestDto,
    );
  }

  // #endregion

  // #region deleteWallet
  /**
   * : Delete a wallet
   */

  @ApiErrorResponse()
  @ApiSuccessResponse(Object)
  @ResponseMessage('Wallet deleted successfully')
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('delete_wallet/:wallet_id')
  async deleteWallet(@Query('wallet_id') walletId: string) {
    return await this.walletService.deleteWallet(walletId);
  }
  // #endregion
}
