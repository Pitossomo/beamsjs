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

export type Result = {
  stiffness: number[][],
  forces: number[]
  displacements: number[],
  reactions: number[] 
  shearForce: (x: number) => number,
  bendingMoment: (x: number) => number
}

export interface iBeam {
  nodes: iNode[],
  edges: iEdge[],
  result?: Result
}

