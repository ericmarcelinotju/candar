/* eslint-disable camelcase */
import { BaseModel } from './model.type'
import { DeviceType } from './deviceType.type'
import { Location } from './location.type'

export class Device extends BaseModel {
  serial_number: string
  tag: string
  address: string
  image: string
  description: string
  coordinate: number[]
  last_checked: Date

  device_type: DeviceType
  device_type_id: string

  location: Location
  location_id: string
}

export class DeviceList {
  total: number
  devices: Device[]
}
