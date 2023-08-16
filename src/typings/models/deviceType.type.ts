/* eslint-disable camelcase */
import { BaseModel } from './model.type'

export class DeviceType extends BaseModel {
  name: string
  description: string
  category: string
  desc_overwrite: boolean
}

export class DeviceTypeList {
  total: number
  device_types: DeviceType[]
}
