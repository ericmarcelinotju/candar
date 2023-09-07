import axios from './index'
import { BaseResponse } from '@/typings/response.type'
import { Client, ClientContact } from '@/typings/models/client.type'

const detail = (id: string): Promise<BaseResponse<ClientContact>> => {
  return axios.get(`/client/contact/${id}`)
}

const insert = (data: ClientContact): Promise<BaseResponse<null>> => {
  return axios.post('/client/contact', data)
}

const update = (id: string, data: Client): Promise<BaseResponse<null>> => {
  return axios.put(`/client/contact/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/client/contact/${id}`)
}

export {
  detail,
  insert,
  update,
  del
}
