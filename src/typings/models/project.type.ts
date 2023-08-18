/* eslint-disable camelcase */
import { BaseModel } from './model.type'
import { User } from './user.type'

export class ProjectForm {
  id: string
  number: string
  name: string
  status: 'cold_call'

  userId: string
  user: User

  // customerId: string
  // customer: Customer
}

export class Project extends BaseModel {
  id: string
  number: string
  name: string
  status: 'cold_call'

  userId: string
  user: User
}

export class ProjectList {
  total: number
  Projects: Project[]
}
