import { BaseModel } from './model.type'

export class Variant extends BaseModel {
  name: string
  disabled?: boolean
}

export class VariantCategory extends BaseModel {
  name: string
  disabled?: boolean
  variant: Variant[]
}
