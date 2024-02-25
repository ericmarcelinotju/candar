import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { CompanyBank } from '@/typings/models/company-bank.type'

const get = (filter?: CompanyBank): Promise<BaseResponse<ListResponse<CompanyBank>>> => {
  return axios.get(`/bank/company${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<CompanyBank>> => {
  return axios.get(`/bank/company/${id}`)
}

const insert = (data: FormData): Promise<BaseResponse<null>> => {
  return axios.post('/bank/company', data)
}

const update = (id: string, data: FormData): Promise<BaseResponse<null>> => {
  return axios.put(`/bank/company/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/bank/company/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
