import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Quotation } from '@/typings/models/quotation.type'

const get = (filter?: Quotation): Promise<BaseResponse<ListResponse<Quotation>>> => {
  return axios.get(`/quotation${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Quotation>> => {
  return axios.get(`/quotation/${id}`)
}

const insert = (data: Quotation): Promise<BaseResponse<null>> => {
  return axios.post('/quotation', data)
}

const update = (id: string, data: Quotation): Promise<BaseResponse<null>> => {
  return axios.put(`/quotation/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/quotation/${id}`)
}

const approveManager = (id: string): Promise<BaseResponse<null>> => {
  return axios.post(`/quotation/${id}/approve-manager`)
}

const approveClient = (id: string, data: FormData): Promise<BaseResponse<null>> => {
  return axios.post(`/quotation/${id}/approve-client`, data)
}

export {
  get,
  detail,
  insert,
  update,
  del,
  approveManager,
  approveClient
}
