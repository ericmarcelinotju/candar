import axios from 'axios'
import router from '@/router'
import stores from '@/stores'
import { errorRoutes } from '@/router/routes'

const axiosInstance = axios.create({
  baseURL: process.env.VITE_APP_API_ADDRESS,
  timeout: 10000,
  transformResponse: [(data) => JSON.parse(data).data],
  withCredentials: true
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      error.message = error.response.data

      if (error.response.status === 401) {
        stores.commit('auth/setLogout')
      } else if (error.response.status === 403) {
        router.replace({ name: errorRoutes.forbidden.name })
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
