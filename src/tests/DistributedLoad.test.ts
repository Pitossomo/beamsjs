import { DistributedLoad } from "../classes/DistributedLoad";

describe("Unitary Trapeze Distributed Load", () => {
  const load = new DistributedLoad(0, 1, 0, 1)

  it('calculates partial values correctly', () => {
    expect(load.valueX(-1)).toEqual(0)
    expect(load.valueX(0)).toEqual(0)
    expect(load.valueX(0.5)).toEqual(0.5)
    expect(load.valueX(1)).toEqual(1)
    expect(load.valueX(2)).toEqual(0)
  })

  it('calculates partial centroid correctly', () => {
    expect(load.partialCentroid(0,0)).toEqual(0)
    expect(load.partialCentroid(0,0.5)).toBeCloseTo(1/3)
    expect(load.partialCentroid(0,1)).toBeCloseTo(2/3)
    expect(load.partialCentroid(1,1)).toEqual(0)
  })

  it('calculates partial force correctly', () => {
    expect(load.partialForce(0,0)).toEqual(0)
    expect(load.partialForce(0,0.5)).toBeCloseTo(0.125)
    expect(load.partialForce(0,1)).toBeCloseTo(0.50)
    expect(load.partialForce(1,1)).toEqual(0)
  })
})

describe("Descendent uniform Distributed Load", () => {
  const load = new DistributedLoad(10,5,-5,15)

  it('calculates partial values correctly', () => {
    expect(load.valueX(-10)).toBeCloseTo(0)
    expect(load.valueX(0)).toBeCloseTo(8.75)
    expect(load.valueX(3)).toBeCloseTo(8)
    expect(load.valueX(6)).toBeCloseTo(7.25)
    expect(load.valueX(11)).toBeCloseTo(6)
  })

  it('calculates partial centroid correctly', () => {
    expect(load.partialCentroid(3,6)).toBeCloseTo(4.4766)
  })

  it('calculates partial force correctly', () => {
    expect(load.partialForce(3,6)).toBeCloseTo(22.875)
  })
})

describe("Small Uniform Distributed Load", () => {
  const load = new DistributedLoad(5, 5, 5, 10)

  it('calculates partial values correctly', () => {
    expect(load.valueX(0)).toBeCloseTo(0)
    expect(load.valueX(5)).toBeCloseTo(5)
    expect(load.valueX(10)).toBeCloseTo(5)
    expect(load.valueX(15)).toBeCloseTo(0)
  })

  it('calculates partial centroid correctly', () => {
    expect(load.partialCentroid(0,5)).toBeCloseTo(0)
    expect(load.partialCentroid(0,10)).toBeCloseTo(7.5)
    expect(load.partialCentroid(0,20)).toBeCloseTo(7.5)
    expect(load.partialCentroid(6,6.7)).toBeCloseTo(6.35)
  })

  it('calculates partial force correctly', () => {
    expect(load.partialForce(-2,13)).toBeCloseTo(25)
  })
})