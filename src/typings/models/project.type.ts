import { Client } from './client.type'
import { BaseModel } from './model.type'
import { ProjectCost } from './project-cost.type'
import { ProjectTask } from './project-task.type'
import { ProjectUpdate } from './project-update.type'
import { Quotation } from './quotation.type'
import { User } from './user.type'

type ProjectStatus = 'initiate' | 'qualification' | 'lead' | 'quotation'

export class Project extends BaseModel {
  id: string
  code: string
  name: string
  description: string
  source: string
  status: ProjectStatus

  userId: string
  // eslint-disable-next-line camelcase
  user_id?: string
  user: User

  clientId: string
  client: Client

  dueDate: string

  updates: ProjectUpdate[]
  tasks: ProjectTask[]
  costs: ProjectCost[]
  quotations: Quotation[]
}

export const getProjectStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case 'initiate': {
      return '#656f7d'
    }
    case 'qualification': {
      return '#ffcc00'
    }
    case 'lead': {
      return '#1090e0'
    }
    case 'quotation': {
      return '#008844'
    }
    default: {
      return ''
    }
  }
}
