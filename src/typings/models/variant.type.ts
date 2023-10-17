import { BaseModel } from './model.type'

export class Variant extends BaseModel {
  name: string
}

export class VariantCategory extends BaseModel {
  name: string
  variants: Variant[]
}
