import axios from './index'
import { BaseResponse } from '@/typings/response.type'

const login = (data): Promise<BaseResponse<null>> => {
  return axios.post('/auth/login', data)
}

const logout = (): Promise<BaseResponse<null>> => {
  return axios.post('/auth/logout')
}

const register = (data): Promise<BaseResponse<null>> => {
  return axios.post('/auth/register', data)
}

const forgotPassword = (data): Promise<BaseResponse<null>> => {
  return axios.post('/forgot-password', data, { timeout: 30000 })
}

const resetPassword = (data): Promise<BaseResponse<null>> => {
  return axios.post('/reset-password', data)
}

export { login, logout, register, forgotPassword, resetPassword }
