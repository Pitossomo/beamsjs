import { DistributedLoad } from "../classes/DistributedLoad";

describe("DistributedLoad", () => {
  const load = new DistributedLoad(19, 49, 2, 8)
  it('calculates partial centroid correctly', () => {
    expect(load.partialCentroid(0,0)).toEqual(0)
    expect(load.partialCentroid(0,10)).toBeCloseTo(5.441)
  })
})