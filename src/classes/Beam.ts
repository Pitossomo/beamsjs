import { iBeam } from "../@types/types"
import { Edge } from "./Edge";
import { Node } from "./Node";
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
    distLoads: DistributedLoad[],
    punctualLoads: PunctualLoad[] = [],
    EI: number = 1,
  ) {
    this.nodes = nodes
    this.edges = []
    for (let i = 0; i<nodes.length-1; i++) {
      this.edges.push(new Edge(
        nodes[i],
        nodes[i+1],
        distLoads.reduce<DistributedLoad[]>((accum, q) => {
          const DX = q.xf - q.x0
          if (q.x0 >= nodes[i+1].x || q.xf <= nodes[i].x || DX === 0) return accum;
          const DQ = q.endValue - q.startValue
          
          const x0 = Math.max(q.x0, nodes[i].x)
          const xf = Math.min(q.xf, nodes[i+1].x)
          const m = DQ/DX
          
          const q0 = q.startValue + (m ? (x0-q.x0)*m : 0)
          const qf = q.startValue + (m ? (xf-q.x0)*m : 0)
          const load = new DistributedLoad(q0, qf, x0, xf)
          return accum.concat(load)
        }, []),
        punctualLoads.filter(p => (
          p.x >= nodes[i].x && (
            (p.x < nodes[i+1].x) ||
            (p.x === nodes[i+1].x && !nodes[i+1].yFixed)
          ))),
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

            // M1t = Moment on the 1st support relative to the triangular part of the load
            // M2t = Moment on the 2nd support relative to the triangular part of the load
            const M1t= p1*c/(540*length**2)*(10*(3*b+c)**2*(3*a+2*c) - 15*c**2*(3*b-length) - 17*c**3)
            const M2t = -p1*c/(540*length**2)*(10*(3*b+c)*(3*a+2*c)**2 - 15*c**2*(3*a-length) - 28*c**3)
            moments[i] += M1t
            moments[i+1] += M2t
            
            // M1r = Moment on the 1st support relative to the rectangular part of the load
            // M2r = Moment on the 2nd support relative to the rectangular part of the load
            const M1r = p2/(12*length**2)*(4*length*((b+c)**3-b**3) - 3*((b+c)**4-b**4))
            const M2r = -p2/(12*length**2)*(4*length*((a+c)**3-a**3) - 3*((a+c)**4-a**4))
            moments[i] += M1r
            moments[i+1] += M2r

            const R2t = (p1*c*(a+2*c/3)/2 - M1t - M2t )/length
            const R1t = p1*c/2 - R2t 

            const R2r = (p2*c*(a+c/2) - M1r - M2r)/length
            const R1r = p2*c - R2r

            forces[i] += R1t + R1r;
            forces[i+1] += R2t + R2r;
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
          } else if (q.x0 >= startNode.x && q.xf <= endNode.x) {
            const force = q.partialForce(startNode.x, endNode.x)
            forces[i] += force
            moments[i] += force*(q.partialCentroid(startNode.x, endNode.x)-startNode.x)
          }
        })
        punctualLoads.forEach(p => {
          if (startNode.x <= p.x && p.x <= endNode.x) {
            forces[i] += p.value
            moments[i] += p.value*(p.x - startNode.x)    
          }       
        })

      } else if (!startNode.yFixed && endNode.yFixed) {
        distributedLoads.forEach(q => {
          if (q.endValue === q.startValue && q.x0 === startNode.x && q.xf === endNode.x) {
            const load = q.startValue
            moments[i+1] += -load*(length**2)/2;
            forces[i+1] += load*length;
          } else if (q.x0 >= startNode.x && q.xf <= endNode.x) {
            const force = q.partialForce(startNode.x, endNode.x)
            forces[i+1] += force
            moments[i+1] += -force*(endNode.x - q.partialCentroid(startNode.x, endNode.x))  
          }
        })
        punctualLoads.forEach(p => {
          if (startNode.x <= p.x && p.x < endNode.x) {
            forces[i+1] += p.value
            moments[i+1] += -p.value*(endNode.x - p.x)    
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
        return accum + 
          this.reactions[i] 
          - edge.distributedLoads.reduce<number>((accum2, q) => accum2 + q.partialForce(q.x0, x), 0)
          - edge.punctualLoads.reduce<number>((accum3, p) => accum3 + ((p.x <= x) ? p.value : 0), 0)
      }, 0
    )
 
    this.bendingMoment = x => this.edges.reduce(
      (accum, edge, i) => {
        if (x <= edge.startNode.x) return accum;

        return (
          accum 
          + this.reactions[i]*(x-edge.startNode.x)
          - edge.distributedLoads.reduce<number>((accum2, q) => (
              accum2 + q.partialForce(q.x0, x)*(x-q.partialCentroid(q.x0, x))
            ), 0)
          - edge.punctualLoads.reduce<number>((accum3, p) => accum3 + ((p.x <= x) ? p.value*(x-p.x) : 0), 0)
        )
      }, 0
    )
  }
}