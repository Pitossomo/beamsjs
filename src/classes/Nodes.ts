import { iNode } from "../@types/types";

export class Node implements iNode {
  x: number;
  yFixed: boolean;

  constructor(x: number, yFixed: boolean = true) {
    this.x = x,
    this.yFixed = yFixed
  }
}