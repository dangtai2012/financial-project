import { EEntityPrefix } from '@common/constants/enums';
import { IJwtPayload } from '@common/interfaces/auth';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IdGeneratorService } from '@shared/id_generator/id_generator.service';
import { CategoryRepository } from './category.repository';
import {
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from './dto/requests';

@Injectable()
export class CategoryService {
  constructor(
    /**
     * : Repositories
     */

    private readonly categoryRepo: CategoryRepository,
    /*end*/

    /**
     * : Services
     */
    private readonly idGeneratorService: IdGeneratorService,
    /*end*/
  ) {}

  // #region createCategory
  /**
   * : Creates a new category.
   */
  async createCategory(
    currentUser: IJwtPayload,
    createCategoryRequestDto: CreateCategoryRequestDto,
  ) {
    const { sub: userId } = currentUser;
    const { catName, catType } = createCategoryRequestDto;

    const catId = await this.idGeneratorService.generate(
      EEntityPrefix.CATEGORY,
    );

    const savedCategory = await this.categoryRepo.save(
      this.categoryRepo.create({
        id: catId,
        catName,
        catType,
        userId: { id: userId },
      }),
    );

    const category = await this.categoryRepo.findOne({
      where: { id: savedCategory.id },
      relations: ['userId'],
      select: {
        id: true,
        catName: true,
        catType: true,
        parentCategoryId: true,
        isDefault: true,
        userId: {
          id: true,
          usrEmail: true,
          usrName: true,
        },
      },
    });

    return category;
  }
  // #endregion

  // #region getAllCategory
  /**
   * : Get all category
   */
  async getAllCategory(currentUser: IJwtPayload) {
    const { sub: userId } = currentUser;
    const categories = await this.categoryRepo.find({
      where: [{ userId: { id: userId } }, { isDefault: true }],
      relations: ['userId'],
      select: {
        id: true,
        parentCategoryId: true,
        catName: true,
        catType: true,
        isDefault: true,
        userId: {
          id: true,
          usrEmail: true,
          usrName: true,
        },
      },
      order: { createdAt: 'DESC' },
    });

    return categories;
  }
  // #endregion

  // #region updateCategory
  /**
   * : Updates a category.
   */
  async updateCategory(
    currentUser: IJwtPayload,
    categoryId: string,
    updateCategoryRequestDto: UpdateCategoryRequestDto,
  ) {
    const { sub: userId } = currentUser;
    const { ...updateFields } = updateCategoryRequestDto;

    const categoryEntity = await this.categoryRepo.findOne({
      where: { id: categoryId, userId: { id: userId } },
      select: {
        id: true,
        parentCategoryId: true,
        catName: true,
        catType: true,
        isDefault: true,
      },
    });

    if (!categoryEntity) {
      throw new NotFoundException(`Category not found `);
    }

    if (categoryEntity.isDefault) {
      throw new NotFoundException(
        `Default categories cannot be updated or deleted`,
      );
    }

    const savedCategory = await this.categoryRepo.save({
      ...categoryEntity,
      ...updateFields,
    });

    const category = await this.categoryRepo.findOne({
      where: { id: savedCategory.id },
      relations: ['userId'],
      select: {
        id: true,
        catName: true,
        catType: true,
        parentCategoryId: true,
        userId: {
          id: true,
          usrEmail: true,
          usrName: true,
        },
      },
    });

    return category;
  }
  // #endregion

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
