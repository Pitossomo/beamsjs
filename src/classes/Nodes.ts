import { iNode } from "../@types/types";

export class Node implements iNode {
  x: number;
  yFixed: boolean;

  static createFixNodes(coords: number[]): Node[] {
    return coords.map(x => new Node(x, true))
  } 

  constructor(x: number, yFixed: boolean = true) {
    this.x = x,
    this.yFixed = yFixed
  }
}