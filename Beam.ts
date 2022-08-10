type Equation = Function

interface Beam {
  length: number,
  load: number
  shear: Equation,
  bending: Equation
}