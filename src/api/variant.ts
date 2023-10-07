import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Variant } from '@/typings/models/variant.type'

const get = (filter?: Variant): Promise<BaseResponse<ListResponse<Variant>>> => {
  return axios.get(`/variant${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Variant>> => {
  return axios.get(`/variant/${id}`)
}

const insert = (data: Variant): Promise<BaseResponse<null>> => {
  return axios.post('/variant', data)
}

const update = (id: string, data: Variant): Promise<BaseResponse<null>> => {
  return axios.put(`/variant/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/variant/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
