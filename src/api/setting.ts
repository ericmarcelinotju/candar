import axios from './index'
import { BaseResponse } from '@/typings/response.type'
import { AppSetting, Setting } from '@/typings/models/setting.type'

const get = (): Promise<AppSetting> => {
  return axios.get('/setting')
    .then(resp => {
      const appSetting = new AppSetting()
      for (const setting of resp.data) {
        appSetting[setting.key] = setting.value
      }
      return appSetting
    })
}

const save = (data: AppSetting): Promise<BaseResponse<null>> => {
  const payload: Setting[] = []
  for (const key in data) {
    payload.push({
      key,
      value: data[key]
    })
  }
  return axios.put('/setting', payload)
}

export {
  get,
  save
}
