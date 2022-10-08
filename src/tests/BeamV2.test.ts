import { Beam } from "../classes/Beam"
import { DistributedLoad } from "../classes/DistributedLoad"
import { Node } from "../classes/Node"
import { PunctualLoad } from "../classes/PunctualLoad"

describe('Hyperstatic beam with 2 loads intersecting each other', () => {
  const distLoad1 = new DistributedLoad(5,5,0,1)
  const distLoad2 = new DistributedLoad(5,5,1,2)
  
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

/*
describe('Hyperstatic beam with 2 loads intersecting each other', () => {
  const distLoad1 = new DistributedLoad(5,5,0,1)
  const distLoad2 = new DistributedLoad(5,10,1,2)
  
  const nodes = [
    new Node(0, true),
    new Node(1, true),
    new Node(2, true)
  ]

  const beam = new Beam(nodes, [distLoad1, distLoad2])

  it('solves for correct reactions', () => {
    const expectedReactions = [1.729, 7.375, 3.396]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(0+dx)).toBeCloseTo(1.729)
    expect(beam.shearForce(1-dx)).toBeCloseTo(-3.271)
    expect(beam.shearForce(1+dx)).toBeCloseTo(4.104)
    expect(beam.shearForce(2-dx)).toBeCloseTo(-3.396)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(1)).toBeCloseTo(-0.771)
    expect(beam.bendingMoment(2)).toBeCloseTo(0)
  })
})
*/