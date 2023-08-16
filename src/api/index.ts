import axios from 'axios'
import router from '@/router'
import stores from '@/stores'
import { forbiddenRoute } from '@/router/routes'
import { config } from '@/config'

const axiosInstance = axios.create({
  baseURL: config.apiAddress,
  timeout: 10000,
  transformResponse: [data => JSON.parse(data).data],
  withCredentials: true
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        stores.commit('auth/setLogout')
      } else if (error.response.status === 403) {
        router.replace({ name: forbiddenRoute.name })
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
