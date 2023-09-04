export class BaseResponse<T> {
  accessTime: string;
  code: number;
  data: T;
  status: string;
}

export class ListResponse<T> {
  total: number
  data: T[]
}
