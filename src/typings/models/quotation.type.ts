import { BaseModel } from './model.type'
import { Project } from './project.type'
import { User } from './user.type'

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

type QuotationStatus = 'draft' | 'sent' | 'approved' | 'accepted'

export class Quotation extends BaseModel {
  id: string
  code: string
  dateFrom: Date
  dateTo: Date
  totalPrice: string

  projectId: string
  project: Project

  quotationProducts: QuotationProduct[]

  status: QuotationStatus

  approvedBy?: User
  approvalAttachment?: string

  revision: number
}
