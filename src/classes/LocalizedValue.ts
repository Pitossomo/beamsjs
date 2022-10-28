import { iLocalizedValue } from "../@types/types"

export class LocalizedValue implements iLocalizedValue {
  x: number
  value: number
  
  constructor (x: number, value: number) {
    this.x = x
    this.value = value
  }
}