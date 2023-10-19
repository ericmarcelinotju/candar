export class Option {
  label: string
  value: string | string[]
}

export class OptionObject {
  label: string
  disabled?: boolean
  value: Array<{
    value: string,
    disabled: boolean
  }>
}
