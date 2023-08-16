import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse } from '@/typings/response.type'
import { Article, ArticleList } from '@/typings/models/article.type'

const get = (filter?: Article): Promise<BaseResponse<ArticleList>> => {
  return axios.get(`/article${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Article>> => {
  return axios.get(`/article/${id}`)
}

const insert = (data: Article): Promise<BaseResponse<null>> => {
  return axios.post('/article', data)
}

const update = (id: string, data: Article): Promise<BaseResponse<null>> => {
  return axios.put(`/article/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/article/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
