import { PunctualLoad } from "../classes/PunctualLoad";

export type Reaction = {
  // vx: number,
  y: number,
  // M: number
}

export interface iNode {
  x: number,
  // y: number,
  // xFixed: boolean,
  yFixed: boolean,
  // rFixed: boolean
}

export interface iEdge {
  startNode: iNode,
  endNode: iNode,
  distributedLoads: iDistributedLoad[],
  punctualLoads: PunctualLoad[]
  EI: number;
  length: number,
}

export interface iDistributedLoad {
  startValue: number,
  endValue: number,
  x0: number,
  xf: number
}

export interface iPunctualLoad {
  value: number,
  x: number
} 

export interface iBeam {
  nodes: iNode[],
  edges: iEdge[]
}

