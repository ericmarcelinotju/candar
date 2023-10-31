import { BaseModel } from './model.type'

export class ProductTier extends BaseModel {
  type: string;
  name: string;
  moq: number;
  discRate: number;
  price: string | number;
  productId: string;
}
