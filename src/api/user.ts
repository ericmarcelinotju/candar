import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { User } from '@/typings/models/user.type'

const get = (filter?: User): Promise<BaseResponse<ListResponse<User>>> => {
  return axios.get(`/user${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<User>> => {
  return axios.get(`/user/${id}`)
}

const insert = (data: User): Promise<BaseResponse<null>> => {
  return axios.post('/user', data)
}

const update = (id: string, data: User): Promise<BaseResponse<null>> => {
  return axios.put(`/user/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/user${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
