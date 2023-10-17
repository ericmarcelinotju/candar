import { BaseModel } from './model.type'

export class Setting extends BaseModel {
  key: string
  value: string
}

export class AppSetting {
  smtpHost: string
  smtpPort: string
  smtpEmail: string
  smtpPassword: string
}
