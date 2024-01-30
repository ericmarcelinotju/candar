import axios from './index'
import { BaseResponse } from '@/typings/response.type'
import { ProductImport } from '@/typings/models/product-import.type'

const insert = (data: FormData): Promise<BaseResponse<ProductImport[]>> => {
  return axios.post('/product/import/product', data)
}

const confirm = (data: ProductImport[]): Promise<BaseResponse<null>> => {
  return axios.post('/product/import/confirm', data)
}

export {
  insert,
  confirm
}
