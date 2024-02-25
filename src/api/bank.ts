import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Bank } from '@/typings/models/bank.type'

const get = (filter?: Bank): Promise<BaseResponse<ListResponse<Bank>>> => {
  return axios.get(`/bank${serializeQueryParams(filter)}`)
}

export {
  get
}
