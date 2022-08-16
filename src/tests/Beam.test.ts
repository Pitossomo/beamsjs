import { Beam } from "../classes/Beam"
import { Node } from "../classes/Nodes"

describe('Beam class', () => {
  const load = 17
  const length = 3.5
  const nodes = [new Node(0), new Node(length)]
  const beam = new Beam(nodes, load)

  it('has correct length property', () => {
    expect(beam.length).toBe(3.5)
    expect(beam.nodes[beam.nodes.length-1].x).toBe(3.5)
  })

  /*
  it('build stiffness matrix correctly', () => {
    
  })

  it('calculate accurate reactions for isostatic beams with 2 supports and no balance', () => {
    expect(beam.reactions[0]).toBeCloseTo(29.75)
    expect(beam.reactions[1]).toBeCloseTo(29.75)
  })

  it('calculate accurate shear force for isostatic beams with 2 supports and no balance', () => {
    //expect(beam.shearForce(0.001)).toBeCloseTo(29.75-0.017)
    expect(beam.shearForce(0.875)).toBeCloseTo(14.875)
    expect(beam.shearForce(1.75)).toBeCloseTo(0)
    expect(beam.shearForce(2.625)).toBeCloseTo(-14.875)
    expect(beam.shearForce(3.5-0.001)).toBeCloseTo(-29.75+0.017)
  })

  it('calculate accurate bending moment for isostatic beams  with 2 supports and no balance', () => {
    expect(beam.bendingMoment(0.0)).toBeCloseTo(0)
    expect(beam.bendingMoment(1.75)).toBeCloseTo(26.03125)
    expect(beam.bendingMoment(3.5)).toBeCloseTo(0)
  })
  */
})