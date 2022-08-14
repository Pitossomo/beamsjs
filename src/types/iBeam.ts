import { iLoad } from "./iLoad"

export interface iBeam {
  length: number,
  loads: iLoad[],
  supports: number[]
  reactions: number[],
  shearForce: (x: number) => number,
  bendingMoment: (x: number) => number
}