
export class BaseResponse<T> {
  appVersion: string;
  code: number;
  data: T;
  status: string | number
}

export class ListResponse<T> {
  data: T[]
  totalItem: number
  totalPage: number
  currentPage: number
}
