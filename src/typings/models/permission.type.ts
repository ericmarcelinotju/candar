import { BaseModel } from './model.type'

export class Permission extends BaseModel {
  module: string
  method: string
  description: string
}

export class PermissionList {
  total: number
  permissions: Permission[]
}
