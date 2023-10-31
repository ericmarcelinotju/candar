import { BaseModel } from './model.type'

export class QuotationProduct extends BaseModel {
  id: string
  quantity: number
  productId: string
  productName: string
  tierId: string
  tierName: string
  price: string
  priceNumber: number
}
