import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TransactionEntity } from '.';
import { TypeOrmBaseEntity } from './typeorm_base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends TypeOrmBaseEntity {
  @Column({
    name: 'parent_category_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  parentCategoryId: string;

  @Column({
    name: 'cat_name',
    type: 'varchar',
    length: 100,
    comment: 'Category name',
  })
  catName: string;

  @Column({
    name: 'cat_type',
    type: 'varchar',
    length: 50,
    comment: 'Category type (expense, income)',
  })
  catType: string;

  @Column({
    name: 'is_default',
    type: 'boolean',
    default: false,
    comment: 'Is default category',
  })
  isDefault: boolean;

  //#region Relations

  //: OneToMany
  @OneToMany(() => TransactionEntity, (transaction) => transaction.categoryId)
  transactions: TransactionEntity[];

  //: ManyToOne
  @ManyToOne(() => UserEntity, (user) => user.categories, {
    nullable: true,
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  userId: UserEntity | null;
}
