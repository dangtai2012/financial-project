import { SetMetadata } from '@nestjs/common';
import { AUTH } from '../constants';

export const Public = () => SetMetadata(AUTH.IS_PUBLIC, true);
