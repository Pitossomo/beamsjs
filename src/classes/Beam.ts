import { iBeam } from "../@types/types"
import { Edge } from "./Edges";
import { Node } from "./Nodes";
import { create, all, lusolve} from "mathjs";
import { zeros } from "../utils";

const config: any  = {
  matrix: 'Array',
  number: 'number'
}
const math = create(all, config)

export class Beam implements iBeam {
  nodes: Node[];
  edges: Edge[];
  length: number;

  stiffness: number[][];
  moments: number[];
  forces: number[];
  displacements: any;
  reactions: any;
  shearForce: (x: number) => number;
  bendingMoment: (x: number) => number;

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

    let stiffness = zeros([nodes.length, nodes.length])
    let vStiffness = zeros([nodes.length, nodes.length])
    let moments = new Array(nodes.length).fill(0)
    let forces = new Array(nodes.length).fill(0)
    
    // Stiffness, main forces and main moments computed
    this.edges.forEach(({load, length, startNode, endNode, EI}, i) => {
      if (startNode.yFixed && endNode.yFixed) {
        if (i===0) {
          moments[i+1] += -load*(length**2)/8;
          forces[i] += 3*load*length/8;
          forces[i+1] += 5*load*length/8;

          stiffness[i+1][i+1] += 3*EI/length
          vStiffness[i][i+1] += 3*EI/length**2
          vStiffness[i+1][i+1] += -3*EI/length**2

        } else if (i===this.edges.length-1) {
          moments[i] += load*(length**2)/8;
          forces[i] += 5*load*length/8;
          forces[i+1] += 3*load*length/8;

          stiffness[i][i] += 3*EI/length;
          vStiffness[i][i] += 3*EI/length**2;
          vStiffness[i+1][i] += -3*EI/length**2;
        } else {
          const vIncrement = load*length/2;
          const mIncrement = load*(length**2)/12 ;
          moments[i] += mIncrement;
          moments[i+1] += mIncrement;
          forces[i] += vIncrement;
          forces[i+1] += vIncrement;
  
          stiffness[i][i] += 4*EI/length;
          stiffness[i+1][i] += 2*EI/length;
          vStiffness[i][i] += 6*EI/(length**2);
          vStiffness[i+1][i] += -6*EI/(length**2);
  
          stiffness[i][i+1] += 2*EI/length;
          stiffness[i+1][i+1] += 4*EI/length;
          vStiffness[i][i+1] += 6*EI/(length**2);
          vStiffness[i+1][i+1] += -6*EI/(length**2);
        }
      } else if (startNode.yFixed && !endNode.yFixed) {
        moments[i] += load*(length**2)/2;
        forces[i] += load*length;
      } else if (!startNode.yFixed && endNode.yFixed) {
        moments[i+1] += load*(length**2)/2;
        forces[i+1] += load*length;
      }
    })

    this.moments = moments;
    this.forces = forces;
    this.stiffness = stiffness;
    this.displacements = math.lusolve(stiffness, moments).map(e => -e[0]);
    this.reactions = math.add(math.multiply(vStiffness,this.displacements), forces)
 
    this.shearForce = x => this.edges.reduce(
      (accum, edge, i) => {
        if (x < edge.startNode.x) return accum;
        
        const loadLength = Math.min(x,edge.endNode.x) - edge.startNode.x
        return accum + this.reactions[i] - loadLength*edge.load
      }, 0
    )
 
    this.bendingMoment = x => this.edges.reduce(
      (accum, edge, i) => {
        if (x < edge.startNode.x) return accum;

        const loadLength = Math.min(x,edge.endNode.x) - edge.startNode.x;
        return (
          accum 
          - loadLength*edge.load*(x-edge.startNode.x-loadLength/2)
          + this.reactions[i]*(x-edge.startNode.x)
        )
      } , 0
    )
  }
}