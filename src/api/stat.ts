import { serializeQueryParams } from '@/utils'
import axios from './index'

const queue = (params) => {
  return axios.get(`/statistic/${serializeQueryParams(params)}`)
}

const dashboard = () => {
  return axios.get('/dashboard/statistic')
}

export {
  queue,
  dashboard
}
