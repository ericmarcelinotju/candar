import { Ref } from 'vue'
import { Option } from './option.type'

export class TableColumn {
  label: string
  key: string
  class?: string
  width?: number
  isHidden?: boolean
  isSortable?: boolean
  isSearchable?: boolean
  searchOptions?: Option[]
  searchType?: 'text' | 'dropdown' | 'date' | 'date-range' | 'image'
}
