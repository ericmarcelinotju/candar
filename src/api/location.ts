import axios from './index'
import {serializeQueryParams} from '@/utils'
import {BaseResponse} from '@/typings/response.type'
import {Location, LocationList} from '@/typings/models/location.type'

const get = (filter?: Location): Promise<BaseResponse<LocationList>> => {
  return axios.get(`/location${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Location>> => {
  return axios.get(`/location/${id}`)
}

const insert = (data: Location): Promise<BaseResponse<null>> => {
  return axios.post('/location', data)
}

const update = (id: string, data: Location): Promise<BaseResponse<null>> => {
  return axios.put(`/location/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/location/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
