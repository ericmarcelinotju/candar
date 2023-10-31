import { BaseModel } from './model.type'

export class ProductCategory extends BaseModel {
  id: string
  code: string
  name: string
  stock: number
  cost: string
  costNumber: number
  price: string
  priceNumber: number
}

export class Product extends BaseModel {
  id: string
  code: string
  name: string
  stock: number
  cost: string
  costNumber: number
  price: string
  priceNumber: number

  categoryId: string
  category: ProductCategory
  disabled?:boolean
}
