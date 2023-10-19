export class Option {
  label: string
  value: string | string[]
}

export class OptionObject {
  id: string
  name: string
  disabled?: boolean
  variant: Array<{
    id: string,
    name: string,
    disabled: boolean
  }>
}
