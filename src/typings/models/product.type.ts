/* eslint-disable camelcase */
import { BaseModel } from './model.type'

export class ProductCategory extends BaseModel {
  id: string
  code: string
  name: string
  stock: number
  cost: number
  price:number
}

export class Product extends BaseModel {
  id: string
  code: string
  name: string
  stock: number
  cost: number
  price:number

  categoryId: string
  category: ProductCategory
}
