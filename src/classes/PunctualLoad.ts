import { iPunctualLoad } from "../@types/types";

export class PunctualLoad implements iPunctualLoad {
  value: number;
  x: number;

  constructor(value: number, x: number) {
    this.value = value,
    this.x = x
  }
}