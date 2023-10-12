/* eslint-disable camelcase */
import { Client } from './client.type'
import { BaseModel } from './model.type'
import { ProjectCost } from './project-cost.type'
import { ProjectTask } from './project-task.type'
import { ProjectUpdate } from './project-update.type'
import { User } from './user.type'

type ProjectStatus = 'initiate' | 'qualification' | 'lead' | 'quotation'

export class Quotation extends BaseModel {
  id: string
  code: string
  date: Date
  totalPrice: string
  source: string
  status: ProjectStatus

  userId: string
  user: User

  clientId: string
  client: Client

  updates: ProjectUpdate[]
  tasks: ProjectTask[]
  costs: ProjectCost[]
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
