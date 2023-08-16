import { BaseModel } from './model.type'

export class Log extends BaseModel {
  level: string
  title: string
  subject: string
  content: string
  type: string
}

export class LogList {
  total: number
  logs: Log[]
}
