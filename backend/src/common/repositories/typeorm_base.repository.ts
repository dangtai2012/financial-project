import { PageMetaDto } from '@common/dtos/paginations';
import { PageRequestDto, SearchRequestDto } from '@common/dtos/requests';
import { PageResponseDto } from '@common/dtos/responses';
import { DeepPartial, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { TypeOrmBaseEntity } from '../../database/entities/typeorm_base.entity';

export abstract class TypeOrmBaseRepository<T extends TypeOrmBaseEntity> {
  constructor(
    /**
     * : Repositories
     */

    private readonly repository: Repository<T>,
    /*end*/
  ) {}

  //#region create
  /**
   * : Create
   */
  create(
    data: Parameters<Repository<T>['create']>[0],
  ): ReturnType<Repository<T>['create']> {
    return this.repository.create(data);
  }
  //#endregion

  //#region createMany
  /**
   * : Create Many
   */
  createMany(
    data: Parameters<Repository<T>['create']>[0][],
  ): ReturnType<Repository<T>['create']>[] {
    return this.repository.create(data);
  }
  //#endregion

  //#region save
  /**
   * : Save
   */

  save(
    entity: Parameters<Repository<T>['save']>[0],
  ): ReturnType<Repository<T>['save']> {
    return this.repository.save(entity);
  }
  //#endregion

  //#region saveMany
  /**
   * : Save Many
   */
  saveMany(entities: DeepPartial<T>[]): Promise<(DeepPartial<T> & T)[]> {
    return this.repository.save(entities);
  }

  //#endregion

  //#region find
  /**
   * : Find
   */
  find(
    options?: Parameters<Repository<T>['find']>[0],
  ): ReturnType<Repository<T>['find']> {
    return this.repository.find(options);
  }
  //#endregion

  //#region findOne
  /**
   * : Find One
   */
  findOne(
    options: Parameters<Repository<T>['findOne']>[0],
  ): ReturnType<Repository<T>['findOne']> {
    return this.repository.findOne(options);
  }

  //#endregion

  //#region update
  /**
   * : Update
   */
  update(
    criteria: Parameters<Repository<T>['update']>[0],
    data: Parameters<Repository<T>['update']>[1],
  ): ReturnType<Repository<T>['update']> {
    return this.repository.update(criteria, data);
  }

  //#endregion

  //#region softDelete
  /**
   * : Soft Delete
   */

  softDelete(
    criteria: Parameters<Repository<T>['softDelete']>[0],
  ): ReturnType<Repository<T>['softDelete']> {
    return this.repository.softDelete(criteria);
  }

  //#endregion

  //#region hardDelete
  /**
   * : Hard Delete
   */

  hardDelete(
    criteria: Parameters<Repository<T>['delete']>[0],
  ): ReturnType<Repository<T>['delete']> {
    return this.repository.delete(criteria);
  }

  //#endregion

  //#region paginate
  /**
   * : Paginate
   */
  async paginate(pageRequestDto: PageRequestDto): Promise<PageResponseDto<T>> {
    const { skip, take, page } = pageRequestDto;

    const [items, total] = await this.repository.findAndCount({
      skip,
      take,
    });

    const meta = new PageMetaDto(take!, total, page!);

    return new PageResponseDto(items, meta);
  }
  //#endregion

  // #region search
  /**
   * : Search
   */
  async search(
    searchRequestDto: SearchRequestDto,
    searchFields: (keyof T)[],
  ): Promise<PageResponseDto<T>> {
    const { skip, take, page, search } = searchRequestDto;

    if (!search) {
      return this.paginate(searchRequestDto);
    }

    const where: FindOptionsWhere<T>[] = [];

    for (const field of searchFields) {
      where.push({
        [field]: ILike(`%${search}%`),
      } as FindOptionsWhere<T>);
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      skip,
      take,
    });

    const meta = new PageMetaDto(take!, total, page!);

    return new PageResponseDto(items, meta);
  }
  // #endregion
}
