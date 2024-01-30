import { ValidationRule } from '@/typings/validation.type'

export const required: ValidationRule = str => str != null && str !== undefined && str.length !== 0

export const alpha: ValidationRule = str => str != null && !!str.match(/^[a-zA-Z ]+$/)

export const numeric: ValidationRule = str => str != null && !!str.match(/^[0-9]+$/)

export const sameAs: (form: any, key: string) => ValidationRule = (form, key) => str => str != null && str === form[key]

export const maxLength: (length: number) => ValidationRule = length => str => str != null && str.length <= length

export const minLength: (length: number) => ValidationRule = length => str => str != null && str.length > length

export const requiredIf: (form: any, key: string, equal: string) => ValidationRule = (form, key, equal) => str => form[key] === equal ? str != null && str !== undefined && str.length !== 0 : true

export const email: ValidationRule = str => str != null && !!str.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)

export const phone: ValidationRule = str => str != null && !!str.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im)

export const httpUrl: ValidationRule = str => {
  let url

  try {
    url = new URL(str)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
