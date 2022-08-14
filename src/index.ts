import { Beam } from "./classes/Beam/Beam"
import { Load } from "./classes/Load/Load"

const loads = [
  new Load(1000, 0, 5)
]

const beam = new Beam(5, loads, [0, 5])

// TODO - Write a test