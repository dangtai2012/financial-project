import { UserEntity } from '@database/entities';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

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

    if (!user.isVerified) {
      throw new UnauthorizedException('Account is not verified (st)');
    }

    return user;
  }
}
