import { BaseModel } from './model.type'
import { Client } from './client.type'

export class Contract extends BaseModel {
  id: string
  code: string
  content: string

  dateFrom: Date
  dateTo: Date

  clientId: string
  client: Client
}
