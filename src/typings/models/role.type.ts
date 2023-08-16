import { BaseModel } from './model.type'
import { Permission } from './permission.type'

export class Role extends BaseModel {
  name: string
  level: number
  permissions: Permission[]
}

export class RoleList {
  total: number
  roles: Role[]
}
