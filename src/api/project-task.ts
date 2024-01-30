import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { ProjectTask } from '@/typings/models/project-task.type'

const get = (filter?: ProjectTask): Promise<BaseResponse<ListResponse<ProjectTask>>> => {
  return axios.get(`/project-task${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<ProjectTask>> => {
  return axios.get(`/project-task/${id}`)
}

const insert = (data: FormData): Promise<BaseResponse<null>> => {
  return axios.post('/project-task', data)
}

const update = (id: string, data: FormData): Promise<BaseResponse<null>> => {
  return axios.put(`/project-task/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/project-task/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
