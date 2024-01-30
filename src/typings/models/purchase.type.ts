import { BaseModel } from './model.type'
import { Product } from './product.type'

export class PurchaseProduct extends BaseModel {
  id: string
  quantity: number
  productId: string
  product: Product
  price: number
  priceDisplay: string
}

export class Purchase extends BaseModel {
  code: string
  note: string
  vendor: string
  date: Date
  purchaseProducts: PurchaseProduct[]
}
