import { BaseModel } from './model.type'

export class PurchaseProduct extends BaseModel {
  productId:string
  price: number
  quantity: number
}

export class Purchase extends BaseModel {
  code: string
  note: string
  vendor: string
  purchaseProducts : PurchaseProduct[]
}
