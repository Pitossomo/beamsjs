import { iEdge } from "../@types/types"
import { Node } from "./Nodes"
import { PunctualLoad } from "./PunctualLoad"

export class Edge implements iEdge {
  startNode: Node
  endNode: Node
  load: number
  punctualLoads: PunctualLoad[]
  length: number
  EI: number

  constructor(startNode: Node, endNode: Node, load: number, punctualLoads: PunctualLoad[], EI: number) {
    this.startNode = startNode
    this.endNode = endNode
    this.load = load
    this.punctualLoads = punctualLoads
    this.length = Math.abs(endNode.x - startNode.x)
    this.EI = EI
  }
}