import { PageMetaDto } from '@common/dtos/paginations';
import { PageRequestDto, SearchRequestDto } from '@common/dtos/requests';
import { PageResponseDto } from '@common/dtos/responses';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
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

  //#region paginateForQuery
  /**
   * : Paginate for Query
   */
  async paginateForQuery(
    pageRequestDto: PageRequestDto<T>,
    query: SelectQueryBuilder<T>,
  ): Promise<PageResponseDto<T>> {
    const { take, page, order, orderBy } = pageRequestDto;

    const total = await query.clone().getCount();

    const items = await query
      .skip(take! * (page! - 1))
      .take(take)
      .orderBy(`${query.alias}.${String(orderBy)}`, order)
      .getMany();

    const pageMeta = new PageMetaDto(take!, total, page!);

    return new PageResponseDto(items, pageMeta);
  }
  //#endregion

  // #region paginateForEntity
  /**
   * : Paginate for Entity
   */
  async paginateForEntity(
    pageRequestDto: PageRequestDto<T>,
    options?: FindManyOptions<T>,
  ): Promise<PageResponseDto<T>> {
    const { take, page, order, orderBy } = pageRequestDto;

    const findOptions: FindManyOptions<T> = {
      ...options,
      skip: take! * (page! - 1),
      take: take,
      order: {
        [orderBy as string]: order,
      } as FindOptionsOrder<T>,
    };

    const [items, total] = await this.repository.findAndCount(findOptions);

    const pageMeta = new PageMetaDto(take!, total, page!);

    return new PageResponseDto(items, pageMeta);
  }
  // #endregion

  // #region searchForQuery
  /**
   * : Search for Query
   */
  async searchForQuery(
    searchRequestDto: SearchRequestDto<T>,
    searchFields: (keyof T)[],
    query: SelectQueryBuilder<T>,
  ): Promise<PageResponseDto<T>> {
    const { search } = searchRequestDto;

    if (!search) {
      return this.paginateForQuery(searchRequestDto, query);
    }

    const whereConditionForSearch: FindOptionsWhere<T>[] = [];

    for (const field of searchFields) {
      whereConditionForSearch.push({
        [field]: ILike(`%${search}%`),
      } as FindOptionsWhere<T>);
    }

    query.where(whereConditionForSearch);

    return this.paginateForQuery(searchRequestDto, query);
  }
  // #endregion

  // #region searchForEntity
  /**
   * : Search for Entity
   */
  async searchForEntity(
    searchRequestDto: SearchRequestDto<T>,
    searchFields: (keyof T)[],
    options?: FindManyOptions<T>,
  ): Promise<PageResponseDto<T>> {
    const { search } = searchRequestDto;

    if (!search) {
      return this.paginateForEntity(searchRequestDto, options);
    }

    const whereConditionForSearch: FindOptionsWhere<T>[] = [];

    for (const field of searchFields) {
      whereConditionForSearch.push({
        [field]: ILike(`%${search}%`),
      } as FindOptionsWhere<T>);
    }

    const findOptions: FindManyOptions<T> = {
      ...options,
      where: whereConditionForSearch,
    };

    return this.paginateForEntity(searchRequestDto, findOptions);
  }
  // #endregion
}
