export class Graph {
    // public readonly id = nanoId()

    constructor(
        public nome: string,
        public tipo: TipoGraph
    ) {}
}

export enum TipoGraph {
    INICIAL = 'Incial',
    ELEMENTO = 'elemento',
    FINAL = 'Final'
}