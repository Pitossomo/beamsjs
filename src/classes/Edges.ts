import { iEdge, Node } from "../types/types";

export class Edge implements iEdge {
  startNode: Node;
  endNode: Node;
  load: number;
  length: number;
  EI: number

  constructor(startNode: Node, endNode: Node, load: number, EI: number) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.load = load;
    this.length = Math.abs(endNode.x - startNode.x);
    this.EI = EI;
  }
}