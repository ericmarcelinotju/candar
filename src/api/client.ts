import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Client } from '@/typings/models/client.type'

const get = (filter?: Client): Promise<BaseResponse<ListResponse<Client>>> => {
  return axios.get(`/client${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Client>> => {
  return axios.get(`/client/${id}`)
}

const insert = (data: Client): Promise<BaseResponse<null>> => {
  return axios.post('/client', data)
}

const update = (id: string, data: Client): Promise<BaseResponse<null>> => {
  return axios.put(`/client/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/client/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
