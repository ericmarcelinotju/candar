/* eslint-disable camelcase */
import { BaseModel } from './model.type'
import { User } from './user.type'

export class ProjectUpdate extends BaseModel {
  id: string
  status: string
  date: number
  note: string

  userId: string
  user: User
}
