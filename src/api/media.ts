import axios from './index'
import { BaseResponse } from '@/typings/response.type'

const upload = (form: FormData): Promise<BaseResponse<string>> => {
  return axios.post('media', form, { timeout: 0 })
}

export {
  upload
}
