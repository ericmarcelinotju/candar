export class BaseResponse<T> {
  accessTime: string;
  code: number;
  data: T;
  status: string;
}
