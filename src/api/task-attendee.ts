import axios from './index'
import { BaseResponse, ListResponse } from '@/typings/response.type'
import { Attendee } from '@/typings/models/task-attendee.type'

const get = (): Promise<BaseResponse<Attendee>> => {
  return axios.get('/project-task/attendees')
}

export {
  get
}
