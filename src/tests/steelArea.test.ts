import { Beam, PunctualLoad, DistributedLoad, Node } from "../index"

describe('Beam object with two gaps, 3 rotation-free y-fixed supports, hyperstatic, with no cantilever ends', () => {
  const distributedLoads = [
    new DistributedLoad(1, 1, 7, 9),
    new DistributedLoad(1, 1, 3.5, 11)
  ]
  const punctualLoads = [
    new PunctualLoad(1, 8),
    new PunctualLoad(1, 2),
    new PunctualLoad(1, 3.5)
  ]
  const nodes = Node.createFixNodes([0, 3.2, 11])
  const beam = new Beam(nodes, distributedLoads, punctualLoads)

  console.log(beam.reactions)

  it('has correct breakpoints', () => {
    expect(beam.breakPoints).toEqual([0, 2, 3.2, 3.5, 8, 11])
  })
  
  it('has correct shearForceArrays', () => {
    const shearForceArray = beam.shearForceArray(100)
    shearForceArray.forEach(({x, value}) => {
      expect(value).toBeCloseTo(beam.shearForce(x))
    })
  })
})