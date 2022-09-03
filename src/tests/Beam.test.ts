import { Beam, PunctualLoad, DistributedLoad, Node } from "../index"

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

  it('calculates main moments correctly', () => {
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
    expect(beam.shearForce(5.4284)).toBeCloseTo(0)
    expect(beam.shearForce(9)).toBeCloseTo(-39.75)
    expect(beam.shearForce(10-dx)).toBeCloseTo(-39.75)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(5)).toBeCloseTo(127.6503)
    expect(beam.bendingMoment(10)).toBeCloseTo(0)
  })
})

describe('Hyperstatic beam with trapezoidal load', () => {
  const distLoad = new DistributedLoad(5,9,2,10)
  const nodes = Node.createFixNodes([0,3,7,15])
  const beam = new Beam(nodes, [distLoad])

  it('solves for correct reactions', () => {
    const expectedReactions = [0.127, 12.826, 40.857, 2.191]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(dx)).toBeCloseTo(0.127)
    expect(beam.shearForce(2)).toBeCloseTo(0.127)
    expect(beam.shearForce(3-dx)).toBeCloseTo(-5.123)
    expect(beam.shearForce(3+dx)).toBeCloseTo(7.703)
    expect(beam.shearForce(7-dx)).toBeCloseTo(-18.297)
    expect(beam.shearForce(7+dx)).toBeCloseTo(22.559)
    expect(beam.shearForce(10)).toBeCloseTo(-2.191)
    expect(beam.shearForce(10-dx)).toBeCloseTo(-2.191)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(2)).toBeCloseTo(0.254)
    expect(beam.bendingMoment(3)).toBeCloseTo(-2.202)
    expect(beam.bendingMoment(4.325)).toBeCloseTo(2.982)
    expect(beam.bendingMoment(7)).toBeCloseTo(-20.725)
    expect(beam.bendingMoment(9.748)).toBeCloseTo(11.221)
    expect(beam.bendingMoment(10)).toBeCloseTo(10.953)
    expect(beam.bendingMoment(15)).toBeCloseTo(0)
  })
})

describe('Punctual loads on cantilevers', () => {
  const nodes = [
    new Node(0, false),
    new Node(3, true),
    new Node(5, true),
    new Node(7, true),
    new Node(8, false)
  ]
  const punctualLoads = [
    new PunctualLoad(17, 1),
    new PunctualLoad(17, 8)
  ]

  const beam = new Beam(nodes, [], punctualLoads)

  it('result in correct forces',() => {
    const expectedForces = [0, 17, 0, 17, 0]
    expectedForces.forEach((val, i) => {
      expect(beam.forces[i]).toBeCloseTo(val)
    })
  })

  it('result in correct reactions',() => {
    const expectedReactions = [0, 40.375, -38.25, 31.875, 0]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('result in correct shear forces', () => {
    expect(beam.shearForce(0)).toBeCloseTo(0)
    expect(beam.shearForce(2)).toBeCloseTo(-17)
    expect(beam.shearForce(4)).toBeCloseTo(23.375)
    expect(beam.shearForce(6)).toBeCloseTo(-14.875)
    expect(beam.shearForce(7)).toBeCloseTo(17)
  })

  it('result in correct bending moments', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(2)).toBeCloseTo(-17)
    expect(beam.bendingMoment(3)).toBeCloseTo(-34)
    expect(beam.bendingMoment(5)).toBeCloseTo(12.750)
    expect(beam.bendingMoment(7)).toBeCloseTo(-17)
    expect(beam.bendingMoment(8)).toBeCloseTo(0)
  })

})

describe('Punctual and distributed loads on cantilevers', () => {
  const nodes = [
    new Node(0, false),
    new Node(3, true),
    new Node(5, true),
    new Node(7, true),
    new Node(8, false)
  ]
  const distributedLoads = [
    new DistributedLoad(13,5,1,2),
    new DistributedLoad(13,5,7,8),
  ]

  const punctualLoads = [
    new PunctualLoad(17, 8)
  ]


  const beam = new Beam(nodes, distributedLoads, punctualLoads)

  it('result in correct forces',() => {
    const expectedForces = [0, 9, 0, 26, 0]
    expectedForces.forEach((val, i) => {
      expect(beam.forces[i]).toBeCloseTo(val)
    })
  })

  it('result in correct reactions',() => {
    const expectedReactions = [0, 20.458, -26.250, 40.792, 0]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('result in correct shear forces', () => {
    const dx = 0.00000001
    expect(beam.shearForce(0)).toBeCloseTo(0)
    expect(beam.shearForce(2)).toBeCloseTo(-9)
    expect(beam.shearForce(4)).toBeCloseTo(11.458)
    expect(beam.shearForce(6)).toBeCloseTo(-14.792)
    expect(beam.shearForce(7+dx)).toBeCloseTo(26)
    expect(beam.shearForce(8-dx)).toBeCloseTo(17)
  })

  it('result in correct bending moments', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(2)).toBeCloseTo(-5.167)
    expect(beam.bendingMoment(3)).toBeCloseTo(-14.167)
    expect(beam.bendingMoment(5)).toBeCloseTo(8.750)
    expect(beam.bendingMoment(7)).toBeCloseTo(-20.833)
    expect(beam.bendingMoment(8)).toBeCloseTo(0)
  })

})

describe('Punctual and distributed loads on cantilevers', () => {
  const nodes = [
    new Node(0, false),
    new Node(3, true),
    new Node(5, true),
    new Node(7, true),
    new Node(8, false)
  ]
  const distributedLoads = [
    new DistributedLoad(10,-5,1,4),
    new DistributedLoad(13,5,7,8),
  ]

  const punctualLoads = [
    new PunctualLoad(17, 8)
  ]

  const beam = new Beam(nodes, distributedLoads, punctualLoads)

  it('result in correct reactions',() => {
    const expectedReactions = [0, 19.448, -26.812, 40.865, 0]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('result in correct shear forces', () => {
    const dx = 0.00000001
    expect(beam.shearForce(0)).toBeCloseTo(0)
    expect(beam.shearForce(2)).toBeCloseTo(-7.500)
    expect(beam.shearForce(4)).toBeCloseTo(11.948)
    expect(beam.shearForce(6)).toBeCloseTo(-14.865)
    expect(beam.shearForce(7+dx)).toBeCloseTo(26)
    expect(beam.shearForce(8-dx)).toBeCloseTo(17)
  })

  it('result in correct bending moments', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(2)).toBeCloseTo(-4.167)
    expect(beam.bendingMoment(3)).toBeCloseTo(-13.333)
    expect(beam.bendingMoment(5)).toBeCloseTo(8.896)
    expect(beam.bendingMoment(7)).toBeCloseTo(-20.833)
    expect(beam.bendingMoment(8)).toBeCloseTo(0)
  })

})

describe('Isostatic beam with trapezoidal load, punctual load and 2 cantilever ends', () => {
  const distLoad = new DistributedLoad(5,9,2,10)
  const punctualLoad = new PunctualLoad(13,10)
  const nodes = [
    new Node(0, false),
    new Node(3),
    new Node(7),
    new Node(15, false)
  ]
  const beam = new Beam(nodes, [distLoad], [punctualLoad])

  it('solves for correct forces', () => {
    const expectedForces = [0, 17.450, 51.550, 0]
    expectedForces.forEach((val, i) => {
      expect(beam.forces[i]).toBeCloseTo(val)
    })
  })


  it('solves for correct reactions', () => {
    const expectedReactions = [0, -1.083, 70.083, 0]
    expectedReactions.forEach((val, i) => {
      expect(beam.reactions[i]).toBeCloseTo(val)
    })
  })

  it('calculates shear forces correctly', () => {
    const dx = 0.00000001
    expect(beam.shearForce(dx)).toBeCloseTo(0)
    expect(beam.shearForce(2)).toBeCloseTo(0)
    expect(beam.shearForce(3-dx)).toBeCloseTo(-5.250)
    expect(beam.shearForce(3+dx)).toBeCloseTo(-6.333)
    expect(beam.shearForce(7-dx)).toBeCloseTo(-32.333)
    expect(beam.shearForce(7+dx)).toBeCloseTo(37.750)
    expect(beam.shearForce(10-dx)).toBeCloseTo(13)
    expect(beam.shearForce(10+dx)).toBeCloseTo(0)
    expect(beam.shearForce(15-dx)).toBeCloseTo(0)
  })

  it('calculates bending moments correctly', () => {
    expect(beam.bendingMoment(0)).toBeCloseTo(0)
    expect(beam.bendingMoment(2)).toBeCloseTo(0)
    expect(beam.bendingMoment(3)).toBeCloseTo(-2.583)
    expect(beam.bendingMoment(7)).toBeCloseTo(-77.250)
    expect(beam.bendingMoment(10)).toBeCloseTo(0)
    expect(beam.bendingMoment(15)).toBeCloseTo(0)
  })
})