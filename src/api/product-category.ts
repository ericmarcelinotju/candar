import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { ProductCategory } from '@/typings/models/product.type'

const get = (filter?: ProductCategory): Promise<BaseResponse<ListResponse<ProductCategory>>> => {
  return axios.get(`/product-category${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<ProductCategory>> => {
  return axios.get(`/product-category/${id}`)
}

const insert = (data: ProductCategory): Promise<BaseResponse<null>> => {
  return axios.post('/product-category', data)
}

const update = (id: string, data: ProductCategory): Promise<BaseResponse<null>> => {
  return axios.put(`/product-category/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/product-category/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
