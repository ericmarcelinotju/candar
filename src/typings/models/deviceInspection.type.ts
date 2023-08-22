/* eslint-disable camelcase */
import { BaseModel } from './model.type'
import { User } from './user.type'
import { Device } from './division.type'
import { Inspection } from './inspection.type'

export class DeviceInspection extends BaseModel {
  id: string
  device_id: string
  device: Device
  inspection_id: string
  inspection:Inspection
  user_id?: string
  user?: User
  manual_status:string
  automatic_status: string
  note: string
}

export class DeviceInspectionList {
  total: number
  devices: DeviceInspection[]
}
