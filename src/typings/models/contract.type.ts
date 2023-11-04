import { BaseModel } from './model.type'
import { Client } from './client.type'

export class Contract extends BaseModel {
  id: string
  code: string
  content: string

  dateFrom: Date
  dateTo: Date

  contract: Contract
  contractId: string

  clientId: string
  client: Client

  attachment: string
}
