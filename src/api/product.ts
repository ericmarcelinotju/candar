import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Product } from '@/typings/models/product.type'

const get = (filter?: Product): Promise<BaseResponse<ListResponse<Product>>> => {
  return axios.get(`/product${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Product>> => {
  return axios.get(`/product/${id}`)
}

const insert = (data: Product): Promise<BaseResponse<null>> => {
  return axios.post('/product', data)
}

const update = (id: string, data: Product): Promise<BaseResponse<null>> => {
  return axios.put(`/product/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/product/${id}`)
}

const importData = (data: FormData): Promise<BaseResponse<null>> => {
  return axios.put('/import/product', data)
}

export {
  get,
  detail,
  insert,
  update,
  del,
  importData
}
