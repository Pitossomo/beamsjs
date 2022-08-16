import { iBeam } from "../@types/types"
import { Edge } from "./Edges";
import { Node } from "./Nodes";

export class Beam implements iBeam {
  nodes: Node[];
  edges: Edge[];

  displacements: any[];
  stiffness: any;
  forces: any[];
  moments: any[];
  length: number;

  constructor(
    nodes: Node[],
    load: number,
    EI: number = 1,
  ) {
    this.nodes = nodes
    this.edges = []
    for (let i = 0; i<nodes.length-1; i++) {
      this.edges.push(new Edge(nodes[i], nodes[i+1], load, EI))
    }
    
    this.length = nodes[nodes.length-1].x

    this.displacements = new Array(nodes.length).fill(0)
    this.stiffness = new Array(nodes.length).fill(new Array(nodes.length).fill(0))
    this.moments = new Array(nodes.length).fill(0)
    this.forces = new Array(nodes.length).fill(0)

    // Stiffness, main forces and main moments computed
    this.edges.forEach(({load, length, startNode, endNode, EI}, i) => {
      if (startNode.yFixed && endNode.yFixed) {
        const vIncrement = load*length/2
        const mIncrement = load*(length**2)/12 
        this.moments[i] += mIncrement
        this.moments[i+1] += mIncrement
        this.forces[i] += vIncrement
        this.forces[i+1] += vIncrement

        this.stiffness[i][i] += 4*EI/(length**2)
        this.stiffness[i+1][i] += 2*EI/(length**2)
        // this.vStiffness[i][i] += 6*ei/length
        // this.vStiffness[i+1][i] += -6*ei/length

        this.stiffness[i][i+1] += 2*EI/(length**2)
        this.stiffness[i+1][i+1] += 4*EI/(length**2)
        // this.vStiffness[i][i+1] += 6*ei/length
        // this.vStiffness[i+1][i+1] += -6*ei/length

      } else if (startNode.yFixed && !endNode.yFixed) {
        this.moments[i] += load*(length**2)/2
        this.forces[i] += load*length
      } else if (!startNode.yFixed && endNode.yFixed) {
        this.moments[i+1] += load*(length**2)/2
        this.forces[i+1] += load*length
      }
    })

    // Solve for displacement matrix
    // TODO
    // this.displacements = ...

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