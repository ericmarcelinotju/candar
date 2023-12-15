import { BaseModel } from './model.type'
import { Project } from './project.type'
import { User } from './user.type'

export class QuotationProduct extends BaseModel {
  id: string
  quantity: number
  price: number
  priceDisplay: string
  productId: string
  productName: string
  tierId: string
  tierName: string
}

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'accepted'
export type QuotationType = 'local' | 'export' | 'all_in'

export class Quotation extends BaseModel {
  id: string
  code: string
  dateFrom: Date
  dateTo: Date
  totalPrice: string
  attachment?: string

  projectId: string
  project: Project

  quotationProducts: QuotationProduct[]

  status: QuotationStatus
  type: QuotationType

  approvedBy?: User
  approvalAttachment?: string

  revision: number
}
