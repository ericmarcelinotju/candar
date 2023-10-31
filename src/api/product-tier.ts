import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { ProductTier } from '@/typings/models/product-tier.type'

const get = (filter?: ProductTier): Promise<BaseResponse<ListResponse<ProductTier>>> => {
  return axios.get(`/product-tier${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<ProductTier>> => {
  return axios.get(`/product-tier/${id}`)
}

export {
  get,
  detail
}
