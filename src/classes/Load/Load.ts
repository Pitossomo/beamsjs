import { iLoad } from "../../types/iLoad"

export class Load implements iLoad {
  value: number
  x0: number
  xf: number
  
  constructor(value: number, x0: number, xf: number) {
    this.value = value,
    this.x0 = x0,
    this.xf = xf
  }
}