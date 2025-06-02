import { JwtConfigService } from '@config/services';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingProvider } from './providers/abstracts';
import { BcryptProvider } from './providers/bcrypt.provider';
import { JwtStrategy, LocalStrategy } from './strategies';
import { CacheModule } from '@shared/cache/cache.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [JwtConfigService],
      useFactory: (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.getSecret(),
        signOptions: {
          audience: jwtConfigService.getAudience(),
          issuer: jwtConfigService.getIssuer(),
        },
      }),
    }),
    CacheModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
