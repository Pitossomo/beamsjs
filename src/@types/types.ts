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
  load: number
  EI: number;
  length: number,
}

export interface iPunctualLoad {
  value: number,
  x: number
} 

export interface iBeam {
  nodes: iNode[],
  edges: iEdge[]
}

