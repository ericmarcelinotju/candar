import axios from './index'
import { serializeQueryParams } from '@/utils'
import { BaseResponse } from '@/typings/response.type'
import { Project, ProjectList } from '@/typings/models/project.type'

const get = (filter?: Project): Promise<BaseResponse<ProjectList>> => {
  return axios.get(`/project${serializeQueryParams(filter)}`)
}

const detail = (id: string): Promise<BaseResponse<Project>> => {
  return axios.get(`/project/${id}`)
}

const insert = (data: Project): Promise<BaseResponse<null>> => {
  return axios.post('/project', data)
}

const update = (id: string, data: Project): Promise<BaseResponse<null>> => {
  return axios.put(`/project/${id}`, data)
}

const del = (id: string): Promise<BaseResponse<null>> => {
  return axios.delete(`/project/${id}`)
}

export {
  get,
  detail,
  insert,
  update,
  del
}
