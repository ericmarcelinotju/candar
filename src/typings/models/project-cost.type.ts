import { BaseModel } from './model.type'

export class ProjectCost extends BaseModel {
  name: string
  description: string
  date: number
  price: string
  projectId: string
  userId: string
}
