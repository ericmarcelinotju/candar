import { BaseModel } from './model.type'

export class Tier {
  name: string;
  type: string;
  moq: number;
  discRate: number;
  price: number;
}

export class Variant {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  disable: boolean;
}

export class ProductImport {
  error: string;
  productCode: string;
  name: string;
  description: string;
  sku: string;
  unitCode: string;
  contain?: any;
  unit?: any;
  hsCode?: any;
  stock: number;
  price: number;
  cost: number;
  bmTariff: number;
  rateCOGS: number;
  insurance: number;
  freight: number;
  bmDuty: number;
  ppn: number;
  pph22: number;
  repack: number;
  others?: any;
  subTotal: number;
  cogs: number;
  sellPrice: number;
  publishPrice: number;
  variants: Variant[][];
  categoryId: string;
  tiers: Tier[];
}
