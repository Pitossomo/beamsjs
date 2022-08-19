import { Beam } from "../classes/Beam"
import { Node } from "../classes/Nodes"

describe('Beam object with two gaps, 3 rotation-free y-fixed supports, hyperstatic, with no cantilever ends', () => {
  const load = 12
  const nodes = Node.createFixNodes([0, 3.2, 8])
  const beam = new Beam(nodes, load)

  it('has correct length property', () => {
    expect(beam.length).toBe(8)
    expect(beam.nodes[beam.nodes.length-1].x).toBe(8)
  })

  it('has correct stiffness matrix', () => {
    const expectedStiffness = [[0,0,0],[0,1.5625,0],[0,0,0]]
    expectedStiffness.forEach((row, i) => {
      row.forEach((val, j) => {
        expect(beam.stiffness[i][j]).toBeCloseTo(val)        
      })
    })
  })

  it('has correct main moments matrix', () => {
    const expectedMoments = [0,19.2,0]
    expectedMoments.forEach((val, i) => {
      expect(beam.moments[i]).toBeCloseTo(val)
    })
  })

  it('has correct main forces matrix', () => {
    const forces = [14.4,60.0,21.6]
    forces.forEach((val, i) => {
      expect(beam.forces[i]).toBeCloseTo(val)
    })
  })

  it('solves for correct displacements', () => {
    const expectedDisplacements = [0,-12.288,0]
    expectedDisplacements.forEach((val, i) => {
      expect(beam.displacements[i]).toBeCloseTo(val)
    })
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