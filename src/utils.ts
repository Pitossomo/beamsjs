import { Node } from "./classes/Node";

export function zeros(dimensions: number[]): any {
  var array = [];

  for (var i = 0; i < dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
  }

  return array;
}

export function steelAreaInBending(
  height: number,
  width: number,
  momentSd: number,
  fck: number,
  cover: number
) {
  let diameter = 0.02
  let steelArea

  let isVerified = false
  while (!isVerified) {
    const usefulHeight = (height - cover - diameter*100/20 - 0.8)/100;
    const [alphac, lamb] = (fck <= 50) 
      ? [0.85, 0.8] 
      : [0.85 * (1 - (fck - 50) / 200), 0.8 - (fck - 50) / 400]
  
    const xRoot = (usefulHeight**2 - (2.8*momentSd*10) / width / alphac / (fck*100))**0.5;
    const x = (usefulHeight - xRoot) / lamb;
    const z = usefulHeight - 0.5*lamb*x;
    steelArea = (momentSd / z / 5)*1.15;
    const dom = (x / usefulHeight < 0.259) ? 2 : 3;
  
    // TODO - verifications
    isVerified = true
    if (isVerified) console.log(
      `Momento: ${momentSd*10} tfm, 
      Área de aço: ${steelArea} cm², 
      Domínio: ${dom}` 
    )
  }
  
  return steelArea;
}

export function createFixNodes(coords: number[]): Node[] {
  return coords.map(x => new Node(x, true))
}