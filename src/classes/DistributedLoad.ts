import { iDistributedLoad } from "../@types/types";

export class DistributedLoad implements iDistributedLoad {
  startValue: number;
  endValue: number;
  x0: number;   
  xf: number;

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
  }
}