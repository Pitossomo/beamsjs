import { iDistributedLoad } from "../@types/types";

export class DistributedLoad implements iDistributedLoad {
  startValue: number;
  endValue: number;
  x0: number;
  xf: number;

  constructor(
    startValue: number,
    endValue: number,
    x0: number,
    xf: number
  ) {
    this.startValue = startValue
    this.endValue = endValue
    this.x0 = x0
    this.xf = xf
  }
}