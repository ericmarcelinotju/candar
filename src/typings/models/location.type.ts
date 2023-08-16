/* eslint-disable camelcase */
import { BaseModel } from './model.type'

export class Location extends BaseModel {
  id: string
  parent_id: string
  level: string
  image: string
  title: string
  coordinates: number[]

  latitude: number
  longitude: number
}

export class LocationList {
  total: number
  locations: Location[]
}
