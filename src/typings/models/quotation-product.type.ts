import { BaseModel } from './model.type'

export class QuotationProduct extends BaseModel {
  id: string
  price: string
  priceNumber: number
  quantity: number
  productId: string
  productName: string
}
