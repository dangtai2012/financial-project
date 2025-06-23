import { Column, Entity, OneToMany } from 'typeorm';
import { CategoryEntity, WalletEntity } from '.';
import { TypeOrmBaseEntity } from './typeorm_base.entity';

@Entity({ name: 'users' })
export class UserEntity extends TypeOrmBaseEntity {
  @Column({
    name: 'usr_name',
    type: 'varchar',
    length: 100,
    comment: 'User name',
  })
  usrName: string;

  @Column({
    name: 'usr_email',
    type: 'varchar',
    length: 255,
    unique: true,
    comment: 'User email',
  })
  usrEmail: string;

  @Column({
    name: 'usr_password',
    type: 'varchar',
    length: 255,
    comment: 'User password',
  })
  usrPassword: string;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
    comment: 'Is user verified',
  })
  isVerified: boolean;

  @Column({ name: 'password_reset_token', type: 'varchar', nullable: true })
  passwordResetToken: string;

  @Column({
    name: 'password_reset_token_expires_at',
    type: 'timestamptz',
    nullable: true,
  })
  passwordResetTokenExpiresAt: Date;

  @Column({ name: 'password_change_at', type: 'timestamptz', nullable: true })
  passwordChangedAt: Date;

  //#region Relations

  //: OneToMany
  @OneToMany(() => WalletEntity, (wallet) => wallet.userId)
  wallets: WalletEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.userId)
  categories: CategoryEntity[];

  //#endregion
}
