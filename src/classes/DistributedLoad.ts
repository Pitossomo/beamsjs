import { iDistributedLoad } from "../@types/types";

export class DistributedLoad implements iDistributedLoad {
  startValue: number
  endValue: number
  x0: number
  xf: number
  tg: number
  xCentroid: number
  totalForce: number
  
  valueX: (x: number) => number
  partialCentroid: (x0: number, xf: number) => number
  partialForce:  (x0: number, xf: number) => number

  constructor(
    startValue: number,
    endValue: number = startValue,
    x0: number = -Infinity,
    xf: number = +Infinity
  ) {
    this.startValue = startValue
    this.endValue = endValue
    this.x0 = x0
    this.xf = xf

    const length = xf - x0
    this.tg = (endValue - startValue)/length || 0
    this.xCentroid = (2*startValue + endValue)*length/(3*(startValue+endValue))
    this.totalForce = (startValue + endValue)/2*length

    this.valueX = x => (x < x0 || x > xf) ? 0 : startValue + this.tg*x
    
    this.partialCentroid = (x0, xf) => {
      if (xf <= this.x0 || x0 >= this.xf) return 0
      if (x0 <= this.x0 && xf >= this.xf) return this.xCentroid

      const newX0 = Math.max(x0, this.x0)
      const newXf = Math.min(xf, this.xf) 

      const [valueX0, valueXf] = [this.valueX(newX0), this.valueX(newXf)] 
      return (2*valueX0 + valueXf)*length/(3*(valueX0+valueXf))
    }

    this.partialForce = (x0, xf) => {
      if (x0 <= this.x0) return 0
      if (xf >= this.xf) return this.totalForce
      return (this.valueX(x0) + this.valueX(xf))*length/2
    } 
  }
}