/* eslint-disable camelcase */
import { Client } from './client.type'
import { BaseModel } from './model.type'
import { User } from './user.type'

export class Project extends BaseModel {
  id: string
  number: string
  name: string
  status: 'initiate' | 'qualification' | 'lead' | 'quotation'

  userId: string
  user: User

  clientId: string
  client: Client
}
