import { iNode } from "../@types/types";
import { createFixNodes } from "../utils";

export class Node implements iNode {
  x: number;
  yFixed: boolean;

  static createFixNodes = (coords: number[]) => createFixNodes(coords)

  constructor(x: number, yFixed: boolean = true) {
    this.x = x,
    this.yFixed = yFixed
  }
}