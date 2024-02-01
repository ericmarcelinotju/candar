import { BaseModel } from './model.type'

export class ClientAddress extends BaseModel {
  name: string
  address: string
  province: string
  city: number
  district: string
  subDistrict: string
  postalCode: string
  coordinates: string
  isDefault: boolean
}

export class ClientContact extends BaseModel {
  name: string
  title: string
  division: string
  phoneNumber: string
  email: string
}

export class Client extends BaseModel {
  name: string
  companyType: string
  purchaseType: string
  credit: number
  phoneNumber: string
  email: string
  website: string
  npwp: string
  haveContract: boolean
  addresses: ClientAddress[]
  contacts: ClientContact[]
}
