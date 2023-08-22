/* eslint-disable camelcase */
import { BaseModel } from './model.type'

export class Client extends BaseModel {
  number: string
  name: string
  industry: string
  address: string
  coordinate: number[]
}

export class ClientList {
  total: number
  clients: Client[]
}
