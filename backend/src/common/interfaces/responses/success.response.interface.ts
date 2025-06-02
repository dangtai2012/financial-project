import { IBaseResponse } from './base.response.interface';

export interface ISuccessResponse<T> extends IBaseResponse {
  data: T;
}
