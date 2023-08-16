/* eslint-disable camelcase */
import { BaseModel } from './model.type'

export class Article extends BaseModel {
  name: string
  content: string
}

export class ArticleList {
  total: number
  articles: Article[]
}
