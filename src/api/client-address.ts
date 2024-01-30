import axios from './index'
import { BaseResponse } from '@/typings/response.type'
import { Client, ClientAddress } from '@/typings/models/client.type'

const detail = (id: string): Promise<BaseResponse<ClientAddress>> => {
  return axios.get(`/client/address/${id}`)
}

const insert = (data: ClientAddress): Promise<BaseResponse<null>> => {
  return axios.post('/client/address', data)
}

const update = (id: string, data: Client): Promise<BaseResponse<null>> => {
  return axios.put(`/client/address/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/client/address/${id}`)
}

export {
  detail,
  insert,
  update,
  del
}
