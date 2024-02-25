import { BaseModel } from './model.type'
import { Bank } from './bank.type'

export class CompanyBank extends BaseModel {
  accountName: string
  accountNumber: string
  accountAddress: string
  bankAddress: string
  bankSwiftCode: string
  active: boolean

  bank: Bank

  public constructor () {
    super()
    this.active = false
  }
}
