import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Log } from '@/typings/models/log.type'

const get = (filter?: Log): Promise<BaseResponse<ListResponse<Log>>> => {
  return axios.get(`/log${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Log>> => {
  return axios.get(`/log/${id}`)
}

const insert = (data: Log): Promise<BaseResponse<null>> => {
  return axios.post('/log', data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/log/${id}`)
}

export {
  get,
  detail,
  insert,
  del
}
