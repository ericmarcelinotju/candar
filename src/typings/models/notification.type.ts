import { BaseModel } from './model.type'

export class Notification extends BaseModel {
    type: string
    link: string
    message: string
    title: string
    note: string
    read: boolean
}
