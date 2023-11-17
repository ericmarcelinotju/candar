import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Notification } from '@/typings/models/notification.type'

const get = (filter?: Notification): Promise<BaseResponse<ListResponse<Notification>>> => {
  return axios.get(`/notification${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Notification>> => {
  return axios.get(`/notification/${id}`)
}

export {
  get,
  detail
}
