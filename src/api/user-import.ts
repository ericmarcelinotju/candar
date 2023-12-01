import axios from './index'
import { BaseResponse } from '@/typings/response.type'
import { UserImport } from '@/typings/models/user-import.type'

const insert = (data: FormData): Promise<BaseResponse<UserImport[]>> => {
  return axios.post('/user/import', data)
}

const confirm = (data: UserImport[]): Promise<BaseResponse<null>> => {
  return axios.post('/user/confirm', data)
}

export {
  insert,
  confirm
}
