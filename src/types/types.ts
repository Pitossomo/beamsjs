export type Reaction = {
  // vx: number,
  y: number,
  // M: number
}

export type Node = {
  x: number,
  // y: number,
  // xFixed: boolean,
  yFixed: boolean,
  // rFixed: boolean
}

export interface iEdge {
  startNode: Node,
  endNode: Node,
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
  nodes: Node[],
  edges: iEdge[],
  result?: Result
}

