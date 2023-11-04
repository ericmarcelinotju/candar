import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Contract } from '@/typings/models/contract.type'

const get = (filter?: Contract): Promise<BaseResponse<ListResponse<Contract>>> => {
  return axios.get(`/contract${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Contract>> => {
  return axios.get(`/contract/${id}`)
}

const insert = (data: FormData): Promise<BaseResponse<null>> => {
  return axios.post('/contract', data)
}

const update = (id: string, data: FormData): Promise<BaseResponse<null>> => {
  return axios.put(`/contract/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/contract/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
