/* eslint-disable camelcase */
import { Client } from './client.type'
import { BaseModel } from './model.type'
import { ProjectCost } from './project-cost.type'
import { ProjectTask } from './project-task.type'
import { ProjectUpdate } from './project-update.type'
import { User } from './user.type'

export class Project extends BaseModel {
  id: string
  code: string
  name: string
  description: string
  status: 'initiate' | 'qualification' | 'lead' | 'quotation'

  userId: string
  user: User

  clientId: string
  client: Client

  updates: ProjectUpdate[]
  tasks: ProjectTask[]
  costs: ProjectCost[]
}
