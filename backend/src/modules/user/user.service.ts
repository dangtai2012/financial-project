import { PageRequestDto } from '@common/dtos/requests';
import { UserEntity } from '@database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '@shared/cache/cache.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    /**
     * : Cache
     */

    private readonly cacheService: CacheService,
    /*end*/
    /**
     * : Repositories
     */
    private readonly userRepo: UserRepository,
    /*end*/
  ) {}
  async findOne(id: string): Promise<UserEntity> {
    const cachedUser = await this.cacheService.get(`user:${id}`);

    if (cachedUser) {
      return typeof cachedUser === 'string'
        ? (JSON.parse(cachedUser) as UserEntity)
        : (cachedUser as UserEntity);
    }

    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.cacheService.set(`user:${id}`, JSON.stringify(user));

    return user;
  }

  // #region findAllUsers
  /**
   * : Find All Users
   */
  async findAllUsers(pageRequestDto: PageRequestDto) {
    return this.userRepo.paginate(pageRequestDto);
  }
  // #endregion
}
