import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { ProjectCost } from '@/typings/models/project-cost.type'

const get = (filter?: ProjectCost): Promise<BaseResponse<ListResponse<ProjectCost>>> => {
  return axios.get(`/project-cost${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<ProjectCost>> => {
  return axios.get(`/project-cost/${id}`)
}

const insert = (data: ProjectCost): Promise<BaseResponse<null>> => {
  return axios.post('/project-cost', data)
}

const update = (id: string, data: ProjectCost): Promise<BaseResponse<null>> => {
  return axios.put(`/project-cost/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/project-cost/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
