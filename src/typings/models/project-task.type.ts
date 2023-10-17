import { BaseModel } from './model.type'

export class ProjectTask extends BaseModel {
  id: string
  name: string
  description: string
  date: number
  attendees: string[]
  picture: string
  attachment: string
  isFinish: boolean
  projectId: string
}
