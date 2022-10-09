import { Beam } from "../classes/Beam"
import { DistributedLoad } from "../classes/DistributedLoad"
import { Node } from "../classes/Node"

describe('Hyperstatic beam with 1 load', () => {
  const distLoad1 = new DistributedLoad(5,5,0,2)
  
  const nodes = [
    new Node(0, true),
    new Node(1, true),
    new Node(2, true)
  ]

  const beam = new Beam(nodes, [distLoad1])

  it('build edges with correct loads', () => {
    const expectedEdgeLoads = [
      {
        x0: 0,
        xf: 1,
        startValue: 5,
        endValue: 5
      },
      {
        x0: 1,
        xf: 2,
        startValue: 5,
        endValue: 5
      }
    ]
    expectedEdgeLoads.forEach(({x0, xf, startValue, endValue}, i) => {
      expect(beam.edges[i].distributedLoads[0].x0).toBeCloseTo(x0)
      expect(beam.edges[i].distributedLoads[0].xf).toBeCloseTo(xf)
      expect(beam.edges[i].distributedLoads[0].startValue).toBeCloseTo(startValue)
      expect(beam.edges[i].distributedLoads[0].endValue).toBeCloseTo(endValue)
    })
  })


  it('solves for correct reactions', () => {
    const expectedReactions = [1.875, 6.250, 1.875]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(0+dx)).toBeCloseTo(1.875)
    expect(beam.shearForce(1-dx)).toBeCloseTo(-3.125)
    expect(beam.shearForce(1+dx)).toBeCloseTo(3.125)
    expect(beam.shearForce(2-dx)).toBeCloseTo(-1.875)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(0.37)).toBeCloseTo(0.352)
    expect(beam.bendingMoment(1)).toBeCloseTo(-0.625)
    expect(beam.bendingMoment(1.63)).toBeCloseTo(0.352)
    expect(beam.bendingMoment(2)).toBeCloseTo(0)
  })
})

describe('Hyperstatic beam with 2 loads', () => {
  const distLoad1 = new DistributedLoad(5,5,0,1)
  const distLoad2 = new DistributedLoad(5,5,1,2)
  
  const nodes = [
    new Node(0, true),
    new Node(1, true),
    new Node(2, true)
  ]

  const beam = new Beam(nodes, [distLoad1, distLoad2])
  it('build edges with correct loads', () => {
    const expectedEdgeLoads = [
      {
        x0: 0,
        xf: 1,
        startValue: 5,
        endValue: 5
      },
      {
        x0: 1,
        xf: 2,
        startValue: 5,
        endValue: 5
      }
    ]
    expectedEdgeLoads.forEach(({x0, xf, startValue, endValue}, i) => {
      expect(beam.edges[i].distributedLoads[0].x0).toBeCloseTo(x0)
      expect(beam.edges[i].distributedLoads[0].xf).toBeCloseTo(xf)
      expect(beam.edges[i].distributedLoads[0].startValue).toBeCloseTo(startValue)
      expect(beam.edges[i].distributedLoads[0].endValue).toBeCloseTo(endValue)
    })
  })

  it('solves for correct reactions', () => {
    const expectedReactions = [1.875, 6.250, 1.875]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(0+dx)).toBeCloseTo(1.875)
    expect(beam.shearForce(1-dx)).toBeCloseTo(-3.125)
    expect(beam.shearForce(1+dx)).toBeCloseTo(3.125)
    expect(beam.shearForce(2-dx)).toBeCloseTo(-1.875)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(0.37)).toBeCloseTo(0.352)
    expect(beam.bendingMoment(1)).toBeCloseTo(-0.625)
    expect(beam.bendingMoment(1.63)).toBeCloseTo(0.352)
    expect(beam.bendingMoment(2)).toBeCloseTo(0)
  })
})

describe('Hyperstatic beam with 2 loads overlapping', () => {
  const distLoad1 = new DistributedLoad(2,2,0,2)
  const distLoad2 = new DistributedLoad(3,3,0,2)
  
  const nodes = [
    new Node(0, true),
    new Node(1, true),
    new Node(2, true)
  ]

  const beam = new Beam(nodes, [distLoad1, distLoad2])
  it('solves for correct reactions', () => {
    const expectedReactions = [1.875, 6.250, 1.875]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(0+dx)).toBeCloseTo(1.875)
    expect(beam.shearForce(1-dx)).toBeCloseTo(-3.125)
    expect(beam.shearForce(1+dx)).toBeCloseTo(3.125)
    expect(beam.shearForce(2-dx)).toBeCloseTo(-1.875)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(0.37)).toBeCloseTo(0.352)
    expect(beam.bendingMoment(1)).toBeCloseTo(-0.625)
    expect(beam.bendingMoment(1.63)).toBeCloseTo(0.352)
    expect(beam.bendingMoment(2)).toBeCloseTo(0)
  })
})

describe('Hyperstatic beam with 2 loads on the same edge', () => {
  const distLoad1 = new DistributedLoad(5,5,0,1.5)
  const distLoad2 = new DistributedLoad(5,5,1.5,2)
  
  const nodes = [
    new Node(0, true),
    new Node(1, true),
    new Node(2, true)
  ]

  const beam = new Beam(nodes, [distLoad1, distLoad2])
  it('solves for correct reactions', () => {
    const expectedReactions = [1.875, 6.250, 1.875]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(0+dx)).toBeCloseTo(1.875)
    expect(beam.shearForce(1-dx)).toBeCloseTo(-3.125)
    expect(beam.shearForce(1+dx)).toBeCloseTo(3.125)
    expect(beam.shearForce(1.5-dx)).toBeCloseTo(0.625)
    expect(beam.shearForce(1.5+dx)).toBeCloseTo(0.625)
    expect(beam.shearForce(2-dx)).toBeCloseTo(-1.875)
  })

  it('calculates bending moments correctly', () => {
    const dx = 0.00000001
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(0.37)).toBeCloseTo(0.352)
    expect(beam.bendingMoment(1)).toBeCloseTo(-0.625)
    expect(beam.bendingMoment(1.5-dx)).toBeCloseTo(-0.31)
    expect(beam.bendingMoment(1.63)).toBeCloseTo(0.352)
    expect(beam.bendingMoment(2)).toBeCloseTo(0)
  })
})