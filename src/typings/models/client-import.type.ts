import { BaseModel } from './model.type'

export class Contact {
  name: string;
  division: string;
  phoneNumber: string;
  email: string;
}

export class Address {
  name: string;
  address: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  coordinates: number[];
  isDefault: boolean;
}

export class ClientImport {
  code: string;
  name: string;
  companyType: string;
  purchaseType: string;
  credit: number;
  phoneNumber: string;
  email: string;
  website: string;
  address: Address;
  contact: Contact;
}
