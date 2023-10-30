import { BaseModel } from './model.type'
import { Client } from './client.type'

export class Contract extends BaseModel {
  id: string
  code: string
  content: string

  dateFrom: Date
  dateTo: Date

  contractId: string

  clientId: string
  client: Client
}
