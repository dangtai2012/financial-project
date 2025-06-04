import { COMMON_CONSTANTS } from '@common/constants';
import { EAuth } from '@common/constants/enums';
import { SetMetadata } from '@nestjs/common';

export const Auth = (authType: EAuth) =>
  SetMetadata(COMMON_CONSTANTS.AUTH_TYPE, authType);
