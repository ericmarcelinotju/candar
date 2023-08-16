/* eslint-disable camelcase */
import { BaseModel } from './model.type'

export class Setting extends BaseModel {
  key: string
  value: string
}

export class SettingList {
  total: number
  settings: Setting[]
}

export class AppSetting {
  smtp_host: string
  smtp_port: string
  smtp_email: string
  smtp_password: string

  apilogik_url: string
  apilogik_key: string
}
