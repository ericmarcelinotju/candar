import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse } from '@/typings/response.type'
import { Log, LogList } from '@/typings/models/log.type'

const get = (filter?: Log): Promise<BaseResponse<LogList>> => {
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
