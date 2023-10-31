import { BaseModel } from './model.type'
import { Project } from './project.type'
import { QuotationProduct } from './quotation-product.type'
import { User } from './user.type'

export class Quotation extends BaseModel {
  id: string
  code: string
  date: Date
  totalPrice: string

  projectId: string
  project: Project

  quotationProducts: QuotationProduct[]

  approveManager: boolean;
  approvedBy?: User;
  approveClient: boolean;
  approvalAttachment?: string;
}
