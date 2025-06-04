import { COMMON_CONSTANTS } from '@common/constants';
import { SetMetadata } from '@nestjs/common';

export const ResponseMessage = (message: string) =>
  SetMetadata(COMMON_CONSTANTS.RESPONSE_MESSAGE, message);
