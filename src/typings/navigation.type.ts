import { FunctionalComponent } from 'vue'

export class Navigation {
  name: string
  module?:string
  href?: string
  icon?: FunctionalComponent
  children?: Navigation[]
}
