import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse } from '@/typings/response.type'
import { Division, DivisionList } from '@/typings/models/division.type'

const get = (filter?: Division): Promise<BaseResponse<DivisionList>> => {
  return axios.get(`/division${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Division>> => {
  return axios.get(`/division/${id}`)
}

const insert = (data: Division): Promise<BaseResponse<null>> => {
  return axios.post('/division', data)
}

const update = (id: string, data: Division): Promise<BaseResponse<null>> => {
  return axios.put(`/division/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/division${id}`)
}

const sync = (): Promise<BaseResponse<null>> => {
  return axios.get('/fetch')
}

export {
  get,
  detail,
  insert,
  update,
  del,
  sync
}
