
export class BaseResponse<T> {
  app_version: string;
  code: number;
  data: T;
  status: string;
}

export class ListResponse<T> {
  data: T[]
  total_item: number
  total_page: number
  current_page: number
}
