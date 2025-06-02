import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserEntity } from '@database/entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    /**
     * : Services
     */

    private readonly authService: AuthService,
    /*end*/
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.authService.validateEmailAndPassword(
      email,
      password,
    );

    if (!user) {
      throw new UnauthorizedException('Login failed');
    }

    return user;
  }
}
