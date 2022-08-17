import { Beam } from "../classes/Beam"
import { Node } from "../classes/Nodes"

describe('Beam class', () => {
  const load = 12
  const nodes = Node.createFixNodes([0, 3.2, 8])
  const beam = new Beam(nodes, load)

  it('has correct length property', () => {
    expect(beam.length).toBe(8)
    expect(beam.nodes[beam.nodes.length-1].x).toBe(8)
  })

  it('build stiffness matrix correctly', () => {
    const expectedStiffness = [[0,0,0],[0,1.5625,0],[0,0,0]]
    expectedStiffness.forEach((row, i) => {
      row.forEach((val, j) => {
        expect(beam.stiffness[i][j]).toBeCloseTo(val)        
      })
    })
  })

  it('build moments matrix correctly', () => {
    const expectedStiffness = [0,19.2,0]
    expectedStiffness.forEach((val, i) => {
      expect(beam.moments[i]).toBeCloseTo(val)
    })
  })

  /*
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