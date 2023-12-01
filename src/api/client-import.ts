import axios from './index'
import { BaseResponse } from '@/typings/response.type'
import { ClientImport } from '@/typings/models/client-import.type'

const insert = (data: FormData): Promise<BaseResponse<ClientImport[]>> => {
  return axios.post('/client/import', data)
}

const confirm = (data: ClientImport[]): Promise<BaseResponse<null>> => {
  return axios.post('/client/confirm', data)
}

export {
  insert,
  confirm
}
