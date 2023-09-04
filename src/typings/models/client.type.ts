/* eslint-disable camelcase */
import { BaseModel } from './model.type'

export class Client extends BaseModel {
  code: string
  name: string
  industry: string
  address: string
  coordinate: number[]
}
