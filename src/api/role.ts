import { serializeQueryParams } from '@/utils'
import axios from './index'
import { BaseResponse } from '@/typings/response.type'
import { Role, RoleList } from '@/typings/models/role.type'

const get = (filter?: Role): Promise<BaseResponse<RoleList>> => {
  return axios.get(`/role${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Role>> => {
  return axios.get(`/role/${id}`)
}

const insert = (data: Role): Promise<BaseResponse<null>> => {
  return axios.post('/role', data)
}

const update = (id: string, data: Role): Promise<BaseResponse<null>> => {
  return axios.put(`/role/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/role${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
