import { BaseModel } from './model.type'

export class Variant {
  id: string
  name: string
  disabled: boolean
}

export class ProductContract {
  moq: string
  discRate: number
  price: number
}

export class ProductCategory extends BaseModel {
  id: string
  code: string
  name: string
  stock: number
  cost: string
  costNumber: number
  price: string
  priceNumber: number

  variant: Variant[]

  iregular: ProductContract[]
  regular: ProductContract[]

  public constructor () {
    super()

    this.iregular = [
      {
        moq: '',
        discRate: 0,
        price: 0
      },
      {
        moq: '',
        discRate: 0,
        price: 0
      },
      {
        moq: '',
        discRate: 0,
        price: 0
      }
    ]

    this.regular = [
      {
        moq: '',
        discRate: 0,
        price: 0
      },
      {
        moq: '',
        discRate: 0,
        price: 0
      },
      {
        moq: '',
        discRate: 0,
        price: 0
      }
    ]
  }
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
}
