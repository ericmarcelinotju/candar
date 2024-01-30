import { BaseModel } from './model.type'
import { Project } from './project.type'

export class ProjectTask extends BaseModel {
  id: string
  name: string
  description: string
  date: number
  attendees: string[]
  type: string | null
  picture: string
  attachment: string
  isFinish: boolean
  project: Project
}
