import { Beam } from "../classes/Beam"
import { DistributedLoad } from "../classes/DistributedLoad"
import { Node } from "../classes/Node"
import { PunctualLoad } from "../classes/PunctualLoad"

describe('Hyperstatic beam with 2 loads intersecting each other', () => {
  const distLoad1 = new DistributedLoad(5,5,1,2)
  const distLoad2 = new DistributedLoad(5,10,2,3)
  
  const nodes = [
    new Node(0, false),
    new Node(1, true),
    new Node(2, true),
    new Node(3, true)
  ]

  const beam = new Beam(nodes, [distLoad1, distLoad2])

  it('solves for correct reactions', () => {
    const expectedReactions = [0, 1.729, 7.375, 3.396]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(0)).toBeCloseTo(0)
    expect(beam.shearForce(1-dx)).toBeCloseTo(0)
    expect(beam.shearForce(1+dx)).toBeCloseTo(1.729)
    expect(beam.shearForce(2-dx)).toBeCloseTo(-3.271)
    expect(beam.shearForce(2+dx)).toBeCloseTo(4.104)
    expect(beam.shearForce(3-dx)).toBeCloseTo(-3.396)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(1)).toBeCloseTo(0)
    expect(beam.bendingMoment(2)).toBeCloseTo(-0.771)
    expect(beam.bendingMoment(3)).toBeCloseTo(0)
  })
})


describe('Isostatic beam with 2 trapezoidal loads intersecting each other', () => {
  /* Create a distributed trapezoidal load passing as parameters:
      - the start value of the load
      - the end value value of the load
      - the start x-coordinate of the load
      - the end x-coordinate of the load
    Optionally, we can just past a single value, in case of a uniform load acting on all the beam
  */
  const distLoad1 = new DistributedLoad(7,8,0,5)
  const distLoad2 = new DistributedLoad(0,10,2,10)
  
  /* For punctual loads, we pass as atributes:
    - the value of the punctual load,
    - the x-coordinate of the punctual load
  */
  const punctualLoad1 = new PunctualLoad(13,12)
  const punctualLoad2 = new PunctualLoad(13,2)

  /* Create the nodes with their support status, with the parameters as following:
      - the x-coordinate of the node,
      - the y-direction situation of the of the node, ie. true if it is fixed, false if it is a cantilever end
    Important to note that only the first and last nodes of the beam can be not fixed.
  */
  const nodes = [
    new Node(0, false),
    new Node(1, true),
    new Node(4, true),
    new Node(8, true),
    new Node(11, true),
    new Node(12, false)
  ]

  /* Finally, we can create the beam, passing as parameters:
    - an array with the nodes created above,
    - an array with all the distributed loads created above
    - an optional array with all punctual loads created above,
    - the optional value of the constant EI, the product of inertia moment and Young's modulus
  */
  const beam = new Beam(nodes, [distLoad1, distLoad2], [punctualLoad1, punctualLoad2], 1)

  it('solves for correct reactions', () => {
    const expectedReactions = [0, 24.613, 37.003, 19.260, 22.024, 0]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(0)).toBeCloseTo(0)
    expect(beam.shearForce(1-dx)).toBeCloseTo(-7.100)
    expect(beam.shearForce(1+dx)).toBeCloseTo(17.513)
    expect(beam.shearForce(2-dx)).toBeCloseTo(10.213)
    expect(beam.shearForce(2+dx)).toBeCloseTo(-2.787)
    expect(beam.shearForce(4-dx)).toBeCloseTo(-20.087)
    expect(beam.shearForce(4-dx)).toBeCloseTo(16.916)
    expect(beam.shearForce(5)).toBeCloseTo(6.091)
    expect(beam.shearForce(8-dx)).toBeCloseTo(-10.784)
    expect(beam.shearForce(8+dx)).toBeCloseTo(8.476)
    expect(beam.shearForce(10)).toBeCloseTo(-9.024)
    expect(beam.shearForce(11-dx)).toBeCloseTo(-9.024)
    expect(beam.shearForce(11+dx)).toBeCloseTo(13)
    expect(beam.shearForce(12-dx)).toBeCloseTo(13)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(1)).toBeCloseTo(-3.533)
    expect(beam.bendingMoment(2)).toBeCloseTo(10.346)
    expect(beam.bendingMoment(4)).toBeCloseTo(-11.694)
    expect(beam.bendingMoment(5)).toBeCloseTo(-0.036)
    expect(beam.bendingMoment(6.4)).toBeCloseTo(4.245)
    expect(beam.bendingMoment(8)).toBeCloseTo(-4.262)
    expect(beam.bendingMoment(9)).toBeCloseTo(0.257)
    expect(beam.bendingMoment(10)).toBeCloseTo(-3.976)
    expect(beam.bendingMoment(11)).toBeCloseTo(-13)
    expect(beam.bendingMoment(12)).toBeCloseTo(0)
  })
})