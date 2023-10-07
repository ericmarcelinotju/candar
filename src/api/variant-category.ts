import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { VariantCategory } from '@/typings/models/variant.type'

const get = (filter?: VariantCategory): Promise<BaseResponse<ListResponse<VariantCategory>>> => {
  return axios.get(`/variant/category${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<VariantCategory>> => {
  return axios.get(`/variant/category/${id}`)
}

const insert = (data: VariantCategory): Promise<BaseResponse<null>> => {
  return axios.post('/variant/category', data)
}

const update = (id: string, data: VariantCategory): Promise<BaseResponse<null>> => {
  return axios.put(`/variant/category/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/variant/category/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
