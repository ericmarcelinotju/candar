/* eslint-disable camelcase */
import { BaseModel } from './model.type'

export class ClientAddress extends BaseModel {
  name: string
  address: string
  province: string
  city: number
  district: string
  sub_district: string
  postal_code: string
  coordinates: string
}

export class ClientContact extends BaseModel {
  name: string
  division: string
  phone_number: string
  email: string
}

export class Client extends BaseModel {
  code: string
  name: string
  company_type: string
  purchase_type: string
  credit: number
  phone_number: string
  email: string
  website: string
  addresses: ClientAddress[]
  contacts: ClientContact[]
}
