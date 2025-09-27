
export const NODE_TYPES = {
    TASK: 'task-node',
    DECISION: 'decision-node',
    SYSTEM: 'system-node',
    END: 'end-node'
} as const;

export const EDGE_TYPES = {
    SOLID: '',
    DOTTED: 'dotted',
    DASHED: 'dashed',
} as const;


export const NODE_STYLES = {
    [NODE_TYPES.TASK]: {
      'background-color': '#0074D9'
    },
    [NODE_TYPES.DECISION]: {
      'background-color': '#FFDC00'
    },
    [NODE_TYPES.SYSTEM]: {
      'background-color': '#009966'
    },
    [NODE_TYPES.END]: {
      'background-color': 'black'
    }
} as const;


export interface MenuItemClasses {
    nodeClasses: string;
    edgeClasses: string;
}

export interface MenuInteConfig {
    id: string;
    content: string;
    tooltipText: string;
    image?: {
        src: string;
        width: number;
        height: number;
        x: number;
        y: number;
    };
    selector: string;
    disabled?: false;
    show?: boolean;
    hasTrailingDivider?: boolean;
    coreAsWell?: boolean;
    onClickFunction: (event: any) => void;
}

export class ContextMenuConfig {
    static createMenuItems(component: any): any[] {
        return [
            {
                id: 'Remove Nó',
                content: 'remove',
                tooltipText: 'remove',
                image: {
                  src: "assets/icons/remove.svg",
                  width: 12,
                  height: 12,
                  x: 6,
                  y: 4
                },
                selector: 'node, edge',
                onClickFunction: (event: any) => {
                  component.removerElemento(event);
                },
                disabled: false,
                show: true,
                hasTrailingDivider: true,
                coreAsWell: false,
                submenu: []
            },
            {
                id: 'add-node',
                content: 'Adicionar Nó de Tarefa',
                tooltipText: 'Adicionar um nó para tarefa no fluxo',
                image: {
                    src : "assets/icons/add.svg",
                    width : 12,
                    height : 12,
                    x : 6,
                    y : 4
                },
                selector: 'node',
                coreAsWell: true,
                onClickFunction: (event: any) => {
                  const classes: MenuItemClasses = {
                    nodeClasses: 'task-node',
                    edgeClasses: 'null'
                    };
                  const position =  {x: 100, y: 70};
                  component.addNode(event, classes, position);
                }
            },
            {
                id: 'add-note-decisão',
                content: 'Adicionar nó de decisão',
                tooltipText: 'Adcione um nó de decisão no fluxo',
                selector: 'node, edge',
                onClickFunction:  (event: any) => {
                  const classes: MenuItemClasses = {
                    nodeClasses: 'decision-node',
                    edgeClasses: 'dashed'
                    };
                  const position = {x: 0, y: 110}
                  component.addNode(event, classes, position);
                },
                disabled: false
            },
            {
                id: 'add-node-ssitema',
                content: 'Adcionar nó de sistema',
                tooltipText: 'Adicionar um nó que representa o sitema com um todo',
                selector: 'node, edge',
                onClickFunction:  (event: any) => {
                  const classes: MenuItemClasses = {
                    nodeClasses: 'system-node',
                    edgeClasses: 'dotted'
                    };
                  const position =  {x: 100, y: 70};
                  component.addNode(event, classes, position);
                },
                disabled: false
            },
            {
                id: 'add-node-separation',
                content: 'Adcionar nó de separacao',
                tooltipText: 'Adicionar um nó que representa separacao no fluxo',
                selector: 'node, edge',
                onClickFunction:  (event: any) => {
                  const classes: MenuItemClasses = {
                    nodeClasses: 'separation-node',
                    edgeClasses: 'null'
                    };
                  const position = {x: 0, y: 100};
                  component.addNode(event, classes, position);
                },
                disabled: false
            },
            {
                id: 'add-node-join',
                content: 'Adcionar nó de juncao',
                tooltipText: 'Adicionar um nó que representa juncao no fluxo',
                selector: 'node, edge',
                onClickFunction:  (event: any) => {
                  const classes: MenuItemClasses = {
                    nodeClasses: 'join-node',
                    edgeClasses: 'null'
                    };
                  const position = {x: 0, y: 110};
                  component.addNode(event, classes, position);
                },
                disabled: false
            },
            {
                id: 'add-node-nachr',
                content: 'Adicionar nó sub-processo',
                tooltipText: 'Adicionar um nó que representa um subprocesso',
                selector: 'node, edge',
                onClickFunction:  (event: any) => {
                  const classes: MenuItemClasses = {
                    nodeClasses: 'subprocess-node',
                    edgeClasses: 'null'
                    };
                  const position = {x: 0, y: 110};
                  component.addNode(event, classes, position);
                },
                disabled: false
            },
            {
                id: 'add-node-final',
                content: 'Adcionar nó de final',
                tooltipText: 'Adicionar um nó final',
                selector: 'node, edge',
                onClickFunction:  (event: any) => {
                    const classes: MenuItemClasses = {
                        nodeClasses: 'end-node',
                        edgeClasses: 'dotted'
                    };
                    const style = { 'background-color': 'black' };
                    const position = {x: 0, y: 110};
                  component.addNode(event, classes, position, style);
                },
                disabled: false
            }
        ]
    }

    static getContextMenuOptions(component: any) {
        return {
            evtType: 'cxttap',
            menuItems: this.createMenuItems(component),
            menuItemClasses: [],
            contextMenuClasses: [],
            submenuIndicador: {
                src: 'assets/icons/submenu-indicator-default.svg',
                width: 12,
                height: 12
            }
        }
    }

}
