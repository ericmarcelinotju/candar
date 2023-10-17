import { BaseModel } from './models/model.type'
import { Option } from './option.type'
import { ValidationRule } from './validation.type'

export class FormSetting {
  key: string
  label: string
  default?: unknown
  isRequired?: boolean
  autocomplete?: string
  rules?: ValidationRule[]
  options?: Option[] | BaseModel[]
  type?: 'text' | 'date' | 'dropdown' | 'combobox' | 'image' | 'textarea' | string
  isMultiple?: boolean
  col?: number
}
