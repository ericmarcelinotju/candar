export type ValidationRule = (str: string) => boolean

export class ValidationItem {
  isValid: boolean
  message?: string
  errors?: string[]

  public constructor () {
    this.isValid = true
    this.message = ''
    this.errors = []
  }
}

export type ValidationResult<T> = { isValid: boolean } & Record<keyof T, ValidationItem>
