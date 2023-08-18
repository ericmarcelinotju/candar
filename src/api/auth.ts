import axios from './index'
import { BaseResponse } from '@/typings/response.type'
import { DeviceList } from '@/typings/models/device.type'

const login = (data): Promise<BaseResponse<DeviceList>> => {
  return axios.post('/auth/login', data)
}

const logout = () => {
  return axios.post('/auth/logout')
}

const register = (data) => {
  return axios.post('/auth/register', data)
}

const forgotPassword = (data) => {
  return axios.post('/forgot-password', data, { timeout: 30000 })
}

const resetPassword = (data) => {
  return axios.post('/reset-password', data)
}

export {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword
}
