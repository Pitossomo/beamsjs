import { Beam } from "../classes/Beam"
import { PunctualLoad } from "../classes/PunctualLoad"
import { DistributedLoad } from "../classes/DistributedLoad"
import { Node } from "../classes/Nodes"

describe('Beam object with two gaps, 3 rotation-free y-fixed supports, hyperstatic, with no cantilever ends', () => {
  const load = new DistributedLoad(12)
  const nodes = Node.createFixNodes([0, 3.2, 8])
  const beam = new Beam(nodes, [load])

  it('has correct length property', () => {
    expect(beam.length).toBe(8)
    expect(beam.nodes[beam.nodes.length-1].x).toBe(8)
  })

  it('solves for correct reactions', () => {
    const expectedReactions = [10.8,62.0,23.2]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.0001
    expect(beam.shearForce(-1)).toBeCloseTo(0)
    expect(beam.shearForce(dx)).toBeCloseTo(10.8)
    expect(beam.shearForce(3.2-dx)).toBeCloseTo(-27.6)
    expect(beam.shearForce(3.2+dx)).toBeCloseTo(34.4)
    expect(beam.shearForce(8-dx)).toBeCloseTo(-23.2)
    expect(beam.shearForce(8)).toBeCloseTo(-23.2)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(0.90)).toBeCloseTo(4.86)
    expect(beam.bendingMoment(3.2)).toBeCloseTo(-26.88)
    expect(beam.bendingMoment(6.07)).toBeCloseTo(22.43)
    expect(beam.bendingMoment(8)).toBeCloseTo(0)
  })
})

describe('Beam object with 3 gaps, 4 rotation-free y-fixed supports, hyperstatic, with no cantilever ends', () => {
  const load = new DistributedLoad(12)
  const nodes = Node.createFixNodes([0, 4.8, 10.2, 14.4])
  const beam = new Beam(nodes, [load])

  it('has correct length property', () => {
    expect(beam.length).toBe(14.4)
    expect(beam.nodes[beam.nodes.length-1].x).toBe(14.4)
  })

  it('solves for correct reactions', () => {
    const expectedReactions = [22.0826,68.8677,63.1048,18.7449]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.0001
    expect(beam.shearForce(dx)).toBeCloseTo(22.0826)
    expect(beam.shearForce(4.8-dx)).toBeCloseTo(-35.5162)
    expect(beam.shearForce(4.8+dx)).toBeCloseTo(33.3491)
    expect(beam.shearForce(10.2-dx)).toBeCloseTo(-31.4485)
    expect(beam.shearForce(10.2+dx)).toBeCloseTo(31.6539)
    expect(beam.shearForce(14.4-dx)).toBeCloseTo(-18.7449)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(1.84)).toBeCloseTo(20.32)
    expect(beam.bendingMoment(4.8)).toBeCloseTo(-32.24)
    expect(beam.bendingMoment(7.58)).toBeCloseTo(14.10)
    expect(beam.bendingMoment(10.2)).toBeCloseTo(-27.11)
    expect(beam.bendingMoment(12.84)).toBeCloseTo(14.64)
    expect(beam.bendingMoment(14.4)).toBeCloseTo(0)
  })
})

describe('Isostatic beam with single gap', () => {
  const load = new DistributedLoad(17)
  const nodes = Node.createFixNodes([0, 7])
  const beam = new Beam(nodes, [load])
  const yReaction = 17*7/2

  it('solves for correct reactions', () => {
    const expectedReactions = [yReaction, yReaction]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.0001
    expect(beam.shearForce(dx)).toBeCloseTo(yReaction)
    expect(beam.shearForce(7-dx)).toBeCloseTo(-yReaction)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(3.5)).toBeCloseTo(104.125)
    expect(beam.bendingMoment(7)).toBeCloseTo(0)
  })
})

describe('Hyperstatic beam with 3 supports and 2 cantilever ends', () => {
  const load = new DistributedLoad(17)
  const nodes = [
    new Node(0, false),
    new Node(2),
    new Node(3),
    new Node(5),
    new Node(7, false)
  ]
  const beam = new Beam(nodes, [load])

  it('solves for correct reactions', () => {
    const expectedReactions = [0,87.13, -41.44, 73.31,0]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(dx)).toBeCloseTo(0)
    expect(beam.shearForce(2-dx)).toBeCloseTo(-34.00)
    expect(beam.shearForce(2+dx)).toBeCloseTo(53.12)
    expect(beam.shearForce(3-dx)).toBeCloseTo(36.13)
    expect(beam.shearForce(3+dx)).toBeCloseTo(-5.31)
    expect(beam.shearForce(5-dx)).toBeCloseTo(-39.31)
    expect(beam.shearForce(5+dx)).toBeCloseTo(34.00)
    expect(beam.shearForce(7-dx)).toBeCloseTo(0)  
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(2)).toBeCloseTo(-34)
    expect(beam.bendingMoment(3)).toBeCloseTo(10.625)
    expect(beam.bendingMoment(5)).toBeCloseTo(-34)
    expect(beam.bendingMoment(7)).toBeCloseTo(0)
  })
})

describe('Isostatic beam with 7m in length and a punctual load of 5 in x=3m', () => {
  const punctualLoad = new PunctualLoad(5, 3)

  const nodes = Node.createFixNodes([0,7])
  const beam = new Beam(nodes, [], [punctualLoad])

  it('solves for correct reactions', () => {
    const expectedReactions = [2.857, 2.143]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(dx)).toBeCloseTo(2.857)
    expect(beam.shearForce(2)).toBeCloseTo(2.857)
    expect(beam.shearForce(5)).toBeCloseTo(-2.143)
    expect(beam.shearForce(7-dx)).toBeCloseTo(-2.143)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(3)).toBeCloseTo(8.57)
    expect(beam.bendingMoment(7)).toBeCloseTo(0)
  })
})

describe('Isostatic beam with trapezoidal load', () => {
  const distLoad = new DistributedLoad(11,17,3,8)
  const nodes = Node.createFixNodes([0,10])
  const beam = new Beam(nodes, [distLoad])

  it('calculates main forces moments', () => {
    const expectedMainMoments = [69.67, -87.75]
    expectedMainMoments.forEach((val, i) => {
      expect(beam.moments[i]).toBeCloseTo(val)
    })
  })

  it('calculates main forces correctly', () => {
    const expectedMainForces = [28.44, 41.56]
    expectedMainForces.forEach((val, i) => {
      expect(beam.forces[i]).toBeCloseTo(val)
    })
  })

  it('solves for correct reactions', () => {
    const expectedReactions = [30.25, 39.75]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(dx)).toBeCloseTo(30.25)
    expect(beam.shearForce(2)).toBeCloseTo(30.25)
    expect(beam.shearForce(4.43)).toBeCloseTo(0)
    expect(beam.shearForce(9)).toBeCloseTo(-39.75)
    expect(beam.shearForce(10-dx)).toBeCloseTo(-39.75)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(5)).toBeCloseTo(126.59)
    expect(beam.bendingMoment(10)).toBeCloseTo(0)
  })
})
