import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Purchase } from '@/typings/models/purchase.type'

const get = (filter?: Purchase): Promise<BaseResponse<ListResponse<Purchase>>> => {
  return axios.get(`/purchase${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Purchase>> => {
  return axios.get(`/purchase/${id}`)
}

const insert = (data: Purchase): Promise<BaseResponse<null>> => {
  return axios.post('/purchase', data)
}

export {
  get,
  detail,
  insert
}
