import { BaseModel } from './model.type'
import { Role } from './role.type'

export class User extends BaseModel {
  username: string
  email: string
  password: string

  avatar: string

  lastLogin: Date

  role: Role
  roleName: string
}
