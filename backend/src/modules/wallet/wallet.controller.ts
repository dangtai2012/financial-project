import { EAuth } from '@common/constants/enums';
import {
  Auth,
  CurrentUser,
  ResponseMessage,
  Serialize,
} from '@common/decorators';
import { SearchRequestDto } from '@common/dtos/requests';
import {
  ApiErrorResponse,
  ApiPaginatedSuccessResponse,
  ApiSuccessResponse,
} from '@common/dtos/responses';
import { IJwtPayload } from '@common/interfaces/auth';
import { WalletEntity } from '@database/entities';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateWalletRequestDto } from './dtos/requests';
import {
  CreateWalletResponseDto,
  GetPaginatedeWalletsResponseDto,
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

  // #region getPaginatedWallets
  /**
   * : Get paginated wallets
   */
  @ApiErrorResponse()
  @ApiPaginatedSuccessResponse(GetPaginatedeWalletsResponseDto)
  @Serialize(GetPaginatedeWalletsResponseDto)
  @ResponseMessage('Wallets retrieved successfully')
  @HttpCode(HttpStatus.OK)
  @Get('get_paginated_wallets')
  async getPaginatedWallets(
    @CurrentUser() currentUser: IJwtPayload,
    @Query() searchRequestDto: SearchRequestDto<WalletEntity>,
  ) {
    return await this.walletService.getPaginatedWallets(
      currentUser,
      searchRequestDto,
    );
  }
  // #endregion

  // #region updateWallet
  /**
   * : Update a wallet
   */

  // @HttpCode(HttpStatus.ACCEPTED)
  // @Post('update_wallet')
  // async updateWallet(
  //   @CurrentUser() currentUser: IJwtPayload,
  //   @Body() updateWalletRequestDto: UpdateWalletRequestDto,
  // ) {
  //   return await this.walletService.updateWallet(
  //     currentUser,
  //     updateWalletRequestDto,
  //   );
  // }

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
