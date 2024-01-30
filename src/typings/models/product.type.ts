import { BaseModel } from './model.type'

export class Variant {
  id: string
  name: string
  disabled: boolean
}

export class ProductContract {
  moq: string | number
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

  source: 'local' | 'import'

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
  cost: string | number
  costNumber: number
  price: string | number
  priceNumber: number

  source: 'local' | 'import'

  bmDuty: string | number
  cogs: string | number
  freight: string | number
  insurance: string | number
  others: string | number
  pph22: string | number
  ppn: string | number
  rateCOGS: number
  repack: string | number
  subTotal: string | number
  bmTariff: number

  categoryId: string
  category: ProductCategory

  iregular: ProductContract[]
  regular: ProductContract[]

  tiers: Array<{ id: string, name: string, type: string } & ProductContract>

  variants: Variant[]

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
