/* eslint-disable camelcase */
import { BaseModel } from './model.type'

export class Division extends BaseModel {
  number: string
  name: string
}

export class DivisionList {
  total: number
  divisions: Division[]
}
