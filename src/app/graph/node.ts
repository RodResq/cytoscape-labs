export interface Node {
  group: string,
  data: { id: string, idParentNode: string },
  position: { x: number, y: number },
  classes: string,
}
