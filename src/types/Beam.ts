interface iLoad {
  value: number
  x0: number,
  xf: number
}

class Load implements iLoad {
  value: number
  x0: number
  xf: number
  
  constructor(value: number, x0: number, xf: number) {
    this.value = value,
    this.x0 = x0,
    this.xf = xf
  }
}


interface iBeam {
  length: number,
  loads: iLoad[],
  supports: number[]
  reactions: number[],
  shearForce: (x: number) => number,
  bendingMoment: (x: number) => number
}


class Beam implements iBeam {
  length: number
  loads: iLoad[]
  supports: number[]
  reactions: number[]
  shearForce: (x: number) => number
  bendingMoment: (x: number) => number

  constructor(
    length: number,
    loads: Load[],
    supports: number[]
  ) {
    this.length = length
    this.loads = loads
    this.supports = supports

    const sumLoads = loads.reduce((sum, load) => sum + load.value*(load.xf - load.x0), 0)
    this.reactions = supports.map(e => sumLoads/supports.length)
    this.shearForce = x => loads.reduce(
      (accum, load) => {
        const loadLength = Math.min(x,load.xf)
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
  }
}