import { Auth, ResponseMessage, Serialize } from '@common/decorators';
import { PageRequestDto, SearchRequestDto } from '@common/dtos/requests';
import {
  ApiErrorResponse,
  ApiPaginatedSuccessResponse,
  ApiSuccessResponse,
} from '@common/dtos/responses';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { UserResponseDto } from './dtos/responses';
import { UserService } from './user.service';
import { EAuth } from '@common/constants/enums';

@ApiBearerAuth()
@Auth(EAuth.IS_PRIVATE)
@Controller('user')
export class UserController {
  constructor(
    /**
     * : Services
     */
    private readonly userService: UserService,
    /*end*/
  ) {}

  // #region findOneUser
  /**
   * : Find One User
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(UserResponseDto)
  @Serialize(UserResponseDto)
  @ResponseMessage('User found successfully')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
  // #endregion

  // #region findAllUsers
  /**
   * : Find All Users
   */

  @ApiErrorResponse()
  @ApiPaginatedSuccessResponse(UserResponseDto)
  @Serialize(UserResponseDto)
  @ResponseMessage('Users found successfully')
  @Get()
  async findAllUsers(@Query() pageRequestDto: SearchRequestDto) {
    return await this.userService.findAllUsers(pageRequestDto);
  }
  // #endregion
}
