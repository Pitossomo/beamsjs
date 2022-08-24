import { iBeam, iPunctualLoad } from "../@types/types"
import { Edge } from "./Edges";
import { Node } from "./Nodes";
import { create, all, lusolve} from "mathjs";
import { zeros } from "../utils";
import { PunctualLoad } from "./PunctualLoad";

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
    distributedLoad: number,
    punctualLoads: PunctualLoad[] = [],
    EI: number = 1,
  ) {
    this.nodes = nodes
    this.edges = []
    for (let i = 0; i<nodes.length-1; i++) {
      this.edges.push(new Edge(
        nodes[i],
        nodes[i+1],
        distributedLoad,
        punctualLoads.filter(p => (p.x >= nodes[i].x && p.x < nodes[i+1].x)),
        EI
      ))
    }
    
    this.length = nodes[nodes.length-1].x

    let stiffness = zeros([nodes.length, nodes.length])
    let vStiffness = zeros([nodes.length, nodes.length])
    let moments = new Array(nodes.length).fill(0)
    let forces = new Array(nodes.length).fill(0)
    
    // Stiffness, main forces and main moments computed
    this.edges.forEach(({load, length, startNode, punctualLoads, endNode, EI}, i) => {
      if (startNode.yFixed && endNode.yFixed) {
        const vIncrement = load*length/2;
        const mIncrement = load*(length**2)/12 ;
        moments[i] += mIncrement;
        moments[i+1] += -mIncrement;
        forces[i] += vIncrement;
        forces[i+1] += vIncrement;

        punctualLoads.forEach(p => {
          const a = (p.x-startNode.x)
          const b = (endNode.x-p.x)
          moments[i] += p.value*a*(b**2)/length**2
          moments[i] += -p.value*b*(a**2)/length**2
          forces[i] += p.value*(b**2)*(3*a+b)/length**3
          forces[i+1] += p.value*(a**2)*(a+3*b)/length**3
        })

        stiffness[i][i] += 4*EI/length;
        stiffness[i+1][i] += 2*EI/length;
        vStiffness[i][i] += 6*EI/(length**2);
        vStiffness[i+1][i] += -6*EI/(length**2);

        stiffness[i][i+1] += 2*EI/length;
        stiffness[i+1][i+1] += 4*EI/length;
        vStiffness[i][i+1] += 6*EI/(length**2);
        vStiffness[i+1][i+1] += -6*EI/(length**2);
      } else if (startNode.yFixed && !endNode.yFixed) {
        moments[i] += load*(length**2)/2;
        forces[i] += load*length;
      } else if (!startNode.yFixed && endNode.yFixed) {
        moments[i+1] += -load*(length**2)/2;
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