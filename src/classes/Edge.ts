import { iEdge } from "../@types/types"
import { DistributedLoad } from "./DistributedLoad"
import { Node } from "./Node"
import { PunctualLoad } from "./PunctualLoad"

export class Edge implements iEdge {
  startNode: Node
  endNode: Node
  distributedLoads: DistributedLoad[]
  punctualLoads: PunctualLoad[]
  length: number
  EI: number
  
  constructor(
    startNode: Node,
    endNode: Node,
    distributedLoads: DistributedLoad[],
    punctualLoads: PunctualLoad[],
    EI: number,
  ) {
    this.startNode = startNode
    this.endNode = endNode
    this.distributedLoads = distributedLoads
    this.punctualLoads = punctualLoads
    this.length = Math.abs(endNode.x - startNode.x)
    this.EI = EI
  }
}