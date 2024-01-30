import { BaseModel } from './model.type'
import { Project } from './project.type'

export class ProjectCost extends BaseModel {
  name: string
  description: string
  date: number
  price: string | number
  projectId: string
  project?: Project
}
