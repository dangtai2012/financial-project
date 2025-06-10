import * as bcrypt from 'bcrypt';
import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from '../../../src/database/entities';

export const UserFactory = setSeederFactory(UserEntity, async () => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('P@ssw0rd1', salt);

  const user = new UserEntity();
  user.name = 'A Lăng đi bộ';
  user.email = 'alan@mail.com';
  user.password = hashedPassword;

  return user;
});
