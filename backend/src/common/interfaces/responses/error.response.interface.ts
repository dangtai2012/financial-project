import { IBaseResponse } from './base.response.interface';

export interface IErrorResponse extends IBaseResponse {
  errors: string[];
  statusCode?: number;
  typeError?: string;
}
