import { Beam, PunctualLoad, DistributedLoad, Node } from "../index"

describe('Isostatic beam', () => {
  const distributedLoads = [
    new DistributedLoad(2.5, 2.5, 0, 4),
  ]
  const nodes = Node.createFixNodes([0, 4])
  const beam = new Beam(nodes, distributedLoads, [], 1)

  it('has correct bendingMoment in middle of section', () => {
    expect(beam.bendingMoment(2)).toBeCloseTo(20000000)
  })

  it('has correct neutral line in middle of section', () => {
    expect(beam.neutralLine(2, 0.14, 0.364, 1.4, 30000000)).toBeCloseTo(0.061)
  })
})