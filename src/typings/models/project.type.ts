import { Client } from './client.type'
import { BaseModel } from './model.type'
import { ProjectCost } from './project-cost.type'
import { ProjectTask } from './project-task.type'
import { ProjectUpdate } from './project-update.type'
import { Quotation } from './quotation.type'
import { User } from './user.type'

export type ProjectStatus = 'initiate' | 'qualification' | 'lead' | 'quotation' | 'win' | 'lose'

export class Project extends BaseModel {
  id: string
  code: string
  name: string
  description: string
  source: string
  status: ProjectStatus

  userId: string
  user: User

  clientId: string
  client: Client

  expiredAt: Date
  isExpired: boolean
  estimate: number

  updates: ProjectUpdate[]
  tasks: ProjectTask[]
  costs: ProjectCost[]
  quotations: Quotation[]
}

export class ProjectClose {
  status: ProjectStatus
  reason: string
}

export const getProjectStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case 'initiate': {
      return '#A5AfBd'
    }
    case 'qualification': {
      return '#F0E462'
    }
    case 'lead': {
      return '#A8AFFF'
    }
    case 'quotation': {
      return '#3289FF'
    }
    case 'win': {
      return '#008844'
    }
    case 'lose': {
      return '#CD5B8A'
    }
    default: {
      return ''
    }
  }
}
