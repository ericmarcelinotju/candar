/* eslint-disable camelcase */
import { BaseModel } from './model.type'
import { User } from './user.type'
import { Inspection } from './inspection.type'

export class UserInspection extends BaseModel {
  id: string
  user_id: string
  user: User
  inspection_id: string
  inspection:Inspection
  role: string
  notify_to_inspect: boolean
  notify_to_approve:boolean
}

export class UserInspectionList {
  total: number
  userInspections: UserInspection[]
}
