export class Graph {
    // public readonly id = nanoId()

    constructor(
        public nome: string,
        public tipo: TypeNode
    ) {}
}

export enum TypeNode {
    INICIAL = 'Incial',
    ELEMENTO = 'elemento',
    FINAL = 'Final'
}