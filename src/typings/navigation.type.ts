import { FunctionalComponent } from 'vue'

export class Navigation {
  name: string
  module?:string
  route?: string
  icon?: FunctionalComponent
  children?: Navigation[]
}
