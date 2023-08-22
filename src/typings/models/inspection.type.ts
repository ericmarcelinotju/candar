/* eslint-disable camelcase */
import { Device } from './division.type'
import { DeviceInspection } from './deviceInspection.type'
import { BaseModel } from './model.type'
import { User } from './user.type'
import { UserInspection } from './userInspection.type'

export class InspectionForm {
  id: string
  code: string
  date: string
  is_scheduled: boolean
  frequency: string

  type: string
  interval: number
  devices: Device[]
  user_inspections: UserInspection[]
}

export class Inspection extends BaseModel {
  id: string
  code: string
  date: string
  created_by_id: string
  created_by: User
  is_scheduled: boolean
  frequency: string

  type: string
  interval: number
  device_inspections: DeviceInspection[]
  user_inspections: UserInspection[]
}

export class InspectionList {
  total: number
  inspections: Inspection[]
}
