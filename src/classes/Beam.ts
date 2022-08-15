import { iBeam, Node, Result } from "../types/types"
import { Edge } from "./Edges";

export class Beam implements iBeam {
  nodes: Node[]
  edges: Edge[]

  displacements: any[];
  stiffness: any;
  forces: any[];

  constructor(
    nodes: Node[],
    load: number,
    EI: number = 1
  ) {
    this.nodes = nodes
    this.edges = []
    for (let i = 0; i<nodes.length-1; i++) {
      this.edges.push(new Edge(nodes[i], nodes[i+1], load, EI))
    }      

    this.displacements = new Array(nodes.length).fill(0)
    this.stiffness = new Array(nodes.length).fill(new Array(nodes.length).fill(0))
    this.forces = new Array(nodes.length).fill(0)

  }
/*
const sumLoads = loads.reduce((sum, load) => sum + load.value*(load.xf - load.x0), 0)
this.reactions = supports.map(e => sumLoads/supports.length)
this.shearForce = x => loads.reduce(
  (accum, load) => {
    const loadLength = Math.min(x,load.xf) - load.x0
    return accum + ((x < load.x0) ? (loadLength-load.x0)*load.value : 0)
  } , 0
) + this.reactions.reduce(
  (accum, reaction, index) => accum + ((supports[index] < x) ? reaction : 0)
  , 0
)
this.bendingMoment = x => loads.reduce(
  (accum, load) => {
    const loadLength = Math.min(x,load.xf)
    return accum + ((x < load.x0) ? Math.pow(loadLength,2)*load.value/2: 0)
  } , 0
) + this.reactions.reduce(
  (accum, reaction, index) => accum + Math.max(0, (x - supports[index])*reaction)
  , 0
)
*/
}