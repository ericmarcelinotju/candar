import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Dashboard } from '@/typings/models/dashboard.type'

// const get = (filter?: Dashboard): Promise<BaseResponse<ListResponse<Dashboard>>> => {
const get = (filter?: Dashboard): Promise<BaseResponse<Dashboard>> => {
  return axios.get(`/dashboard${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Dashboard>> => {
  return axios.get(`/dashboard/${id}`)
}

const insert = (data: Dashboard): Promise<BaseResponse<null>> => {
  return axios.post('/dashboard', data)
}

const update = (id: string, data: Dashboard): Promise<BaseResponse<null>> => {
  return axios.put(`/dashboard/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/dashboard/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
