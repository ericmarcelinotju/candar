import axios from './index'

const login = (data) => {
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
