import { iBeam } from "../@types/types"
import { Edge } from "./Edges";
import { Node } from "./Nodes";
import { create, all } from "mathjs";
import { zeros } from "../utils";
import { PunctualLoad } from "./PunctualLoad";
import { DistributedLoad } from "./DistributedLoad";

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
    distributedLoads: DistributedLoad[],
    punctualLoads: PunctualLoad[] = [],
    EI: number = 1,
  ) {
    this.nodes = nodes
    this.edges = []
    for (let i = 0; i<nodes.length-1; i++) {
      this.edges.push(new Edge(
        nodes[i],
        nodes[i+1],
        distributedLoads.reduce<DistributedLoad[]>((accum, q) => {
          const DX = q.xf - q.x0
          if (q.x0 > nodes[i+1].x || q.xf < nodes[i].x || DX === 0) return accum;
          const DQ = q.endValue - q.startValue
          
          const x0 = Math.max(q.x0, nodes[i].x)
          const xf = Math.min(q.xf, nodes[i+1].x)
          const m = DQ/DX
          
          const q0 = q.startValue + (m ? (x0-q.x0)*m : 0)
          const qf = q.startValue + (m ? (xf-q.x0)*m : 0)
          const load = new DistributedLoad(q0, qf, x0, xf)
          return accum.concat(load)
        }, []),
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
    this.edges.forEach(({distributedLoads, length, startNode, punctualLoads, endNode, EI}, i) => {
      if (startNode.yFixed && endNode.yFixed) {
        distributedLoads.forEach(q => {
          if (q.endValue === q.startValue && q.x0 === startNode.x && q.xf === endNode.x) {
            const load = q.startValue
            const vIncrement = load*length/2;
            const mIncrement = load*(length**2)/12 ;
            moments[i] += mIncrement;
            moments[i+1] += -mIncrement;
            forces[i] += vIncrement;
            forces[i+1] += vIncrement;  
          } else {
            const a = q.x0 - startNode.x
            const c = q.xf - q.x0
            const b = endNode.x - q.xf
            const p1 = q.endValue - q.startValue
            const p2 = q.startValue

            moments[i] += p1*c/(540*length**2)*(10*(3*b+c)**2*(3*a+2*c) - 15*c**2*(3*b-length) - 17*c**3)
            moments[i+1] += -p1*c/(540*length**2)*(10*(3*b+c)*(3*a+2*c)**2 - 15*c**2*(3*a-length) - 28*c**3)

            moments[i] += p2/(12*length**2)*(4*length*((b+c)**3-b**3) - 3*((b+c)**4-b**4))
            moments[i+1] += -p2/(12*length**2)*(4*length*((a+c)**3-a**3) - 3*((a+c)**4-a**4))

            // TODO - Calculate main forces
            // forces[i] += ??;
            // forces[i+1] += ??;  
          }
        })

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
        distributedLoads.forEach(q => {
          if (q.endValue === q.startValue && q.x0 === startNode.x && q.xf === endNode.x) {
            const load = q.startValue
            moments[i] += load*(length**2)/2;
            forces[i] += load*length;  
          }
        })
      } else if (!startNode.yFixed && endNode.yFixed) {
        distributedLoads.forEach(q => {
          if (q.endValue === q.startValue && q.x0 === startNode.x && q.xf === endNode.x) {
            const load = q.startValue
            moments[i+1] += -load*(length**2)/2;
            forces[i+1] += load*length;
          }
        })
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
        const distLoadLength = Math.min(x,edge.endNode.x) - edge.startNode.x

        return (
          accum 
          + this.reactions[i] 
          - distributedLoads.reduce<number>((accum, q) => accum + distLoadLength*q.startValue, 0)
          - punctualLoads.reduce<number>((accum, p) => accum + ((p.x <= x) ? p.value : 0), 0)
        ) 
      }, 0
    )
 
    this.bendingMoment = x => this.edges.reduce(
      (accum, edge, i) => {
        if (x < edge.startNode.x) return accum;

        const loadLength = Math.min(x,edge.endNode.x) - edge.startNode.x;
        return (
          accum 
          + this.reactions[i]*(x-edge.startNode.x)
          - distributedLoads.reduce<number>((accum, q) => accum + loadLength*q.startValue*(x-edge.startNode.x-loadLength/2), 0)
          - punctualLoads.reduce<number>((accum2, p) => accum2 + ((p.x <= x) ? p.value*(x-p.x) : 0), 0)
        )
      }, 0
    )
  }
}