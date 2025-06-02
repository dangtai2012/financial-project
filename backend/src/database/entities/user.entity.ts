import { Column, Entity } from 'typeorm';
import { TypeOrmBaseEntity } from './typeorm_base.entity';

@Entity({ name: 'users' })
export class UserEntity extends TypeOrmBaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'password_change_at', type: 'timestamp', nullable: true })
  passwordChangedAt: Date;
}
