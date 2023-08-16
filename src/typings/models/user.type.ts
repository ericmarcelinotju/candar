/* eslint-disable camelcase */
import { BaseModel } from './model.type'
import { Role } from './role.type'

export class User extends BaseModel {
  username: string
  email: string
  password: string

  last_login: Date

  role: Role
  role_name: string
}

export class UserList {
  total: number
  users: User[]
}
