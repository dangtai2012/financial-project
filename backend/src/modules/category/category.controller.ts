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
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import {
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from './dto/requests';
import {
  CreateCategoryResponseDto,
  GetAllCategoryResponseDto,
  UpdateCategoryResponseDto,
} from './dto/responses';

@ApiBearerAuth()
@Auth(EAuth.IS_PRIVATE)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // #region createCategory
  /**
   * : Creates a new category.
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(CreateCategoryResponseDto)
  @Serialize(CreateCategoryResponseDto)
  @ResponseMessage('Category created successfully')
  @HttpCode(HttpStatus.CREATED)
  @Post('create_category')
  async createCategory(
    @CurrentUser() currentUser: IJwtPayload,
    @Body() createCategoryRequestDto: CreateCategoryRequestDto,
  ) {
    return await this.categoryService.createCategory(
      currentUser,
      createCategoryRequestDto,
    );
  }
  // #endregion

  // #region getAllCategory
  /**
   * : Get all category
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(GetAllCategoryResponseDto)
  @Serialize(GetAllCategoryResponseDto)
  @ResponseMessage('Categories retrieved successfully')
  @HttpCode(HttpStatus.OK)
  @Get('get_all_category')
  async getAllCategory(@CurrentUser() currentUser: IJwtPayload) {
    return await this.categoryService.getAllCategory(currentUser);
  }
  // #endregion

  // #region updateCategory
  /**
   * : Updates a category.
   */
  @ApiErrorResponse()
  @ApiSuccessResponse(UpdateCategoryResponseDto)
  @Serialize(UpdateCategoryResponseDto)
  @ResponseMessage('Category updated successfully')
  @HttpCode(HttpStatus.OK)
  @Patch('update_category/:category_id')
  async updateCategory(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('category_id') categoryId: string,
    @Body() updateCategoryRequestDto: UpdateCategoryRequestDto,
  ) {
    return await this.categoryService.updateCategory(
      currentUser,
      categoryId,
      updateCategoryRequestDto,
    );
  }
  // #endregion

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoryService.remove(+id);
  // }
}
