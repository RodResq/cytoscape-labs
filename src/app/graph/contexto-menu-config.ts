import { MenuItemClasses, NodeType, EdgeType } from "@shared/types/graph.types";
import { cytoscapeStyles } from "./cytoscape-styles";


export const styles = cytoscapeStyles.reduce<{ [key: string]: any }>((acc, style: any) => {
  const nodeType = style.selector.replace('.', '');
  acc[nodeType] = style.style;
  return acc;
}, {});

export class ContextMenuConfig {
    static createMenuItems(component: any): any[] {

      const subNodeTarefa = {
        id: 'add-node-task',
        content: 'Tarefa',
        tooltipText: 'Adicionar um nó de tarefa',
        onClickFunction: (event: any) => {
          const classes: MenuItemClasses = {
            nodeClasses: NodeType.TASK,
            edgeClasses: 'null',
            styles: styles[NodeType.TASK]
          };
          component.addNode(event, classes);
        }
      };


      const subNodeDecision = {
        id: 'add-note-decisão',
        content: 'Decisão',
        tooltipText: 'Adcione um nó de decisão no fluxo',
        selector: 'node, edge',
        onClickFunction: (event: any) => {
          const classes: MenuItemClasses = {
            nodeClasses: NodeType.DECISION,
            edgeClasses: EdgeType.DASHED,
            styles: styles[NodeType.DECISION]
          };
          component.addNode(event, classes);
        },
        disabled: false
      };


      const subNodeSystem = {
        id: 'add-node-ssitema',
        content: 'Sistema',
        tooltipText: 'Adicionar um nó que representa o sitema com um todo',
        selector: 'node, edge',
        onClickFunction: (event: any) => {
          const classes: MenuItemClasses = {
            nodeClasses: NodeType.SYSTEM,
            edgeClasses: EdgeType.DOTTED,
            styles: styles[NodeType.SYSTEM]
          };
          component.addNode(event, classes);
        },
        disabled: false
      };


      const subNodeSeparation = {
        id: 'add-node-separation',
        content: 'Separacao',
        tooltipText: 'Adicionar um nó que representa separacao no fluxo',
        selector: 'node, edge',
        onClickFunction: (event: any) => {
          const classes: MenuItemClasses = {
            nodeClasses: NodeType.SEPARATION,
            edgeClasses: 'null',
            styles: styles[NodeType.SEPARATION]
          };
          component.addNode(event, classes);
        },
        disabled: false
      };

      const subNodeJoin = {
        id: 'add-node-join',
        content: 'Junção',
        tooltipText: 'Adicionar um nó que representa juncao no fluxo',
        selector: 'node, edge',
        onClickFunction: (event: any) => {
          const classes: MenuItemClasses = {
            nodeClasses: NodeType.JOIN,
            edgeClasses: 'null',
            styles: styles[NodeType.JOIN]
          };
          component.addNode(event, classes);
        },
        disabled: false
      };

      const subNodeProcess = {
        id: 'add-node-nachr',
        content: 'Sub-Processo',
        tooltipText: 'Adicionar um nó que representa um subprocesso',
        selector: 'node, edge',
        onClickFunction: (event: any) => {
          const classes: MenuItemClasses = {
            nodeClasses: NodeType.SUBPROCESS,
            edgeClasses: 'null',
            styles: styles[NodeType.SUBPROCESS]
          };
          component.addNode(event, classes);
        },
        disabled: false
      };

      const subNodeEnd = {
        id: 'end-node',
        content: 'Final',
        tooltipText: 'Adicionar um nó final',
        selector: 'node, edge',
        onClickFunction: (event: any) => {
          const classes: MenuItemClasses = {
            nodeClasses: NodeType.END,
            edgeClasses: EdgeType.DOTTED,
            styles: styles[NodeType.END]
          };
          component.addNode(event, classes);
        },
        disabled: false
      };


        return [
          {
                id: 'metadata',
                content: 'Metadados',
                tooltipText: 'metadados',
                image: {
                  src: "assets/icons/metadata.svg",
                  width: 12,
                  height: 12,
                  x: 6,
                  y: 4
                },
                selector: 'node, edge',
                onClickFunction: (event: any) => {
                  component.metadata(event);
                },
                disabled: false,
                show: true,
                hasTrailingDivider: true,
                coreAsWell: false
            },
            {
                id: 'edit-node',
                content: 'Editar',
                tooltipText: 'editar',
                image: {
                  src: "assets/icons/edit.svg",
                  width: 12,
                  height: 12,
                  x: 6,
                  y: 4
                },
                selector: 'node, edge',
                onClickFunction: (event: any) => {
                  component.editNode(event);
                },
                disabled: false,
                show: true,
                hasTrailingDivider: true,
                coreAsWell: false
            },
            {
                id: 'remove-node',
                content: 'Remover',
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
                coreAsWell: false
            },
            {
                id: 'add-node',
                content: 'Adicionar Nó',
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
                submenu: [
                  subNodeTarefa,
                  subNodeDecision,
                  subNodeSystem,
                  subNodeSeparation,
                  subNodeJoin,
                  subNodeProcess,
                  subNodeEnd
                ]
            },
            {
              id: 'setup-node',
              content: 'Configurar Nó',
              selector: 'node, edge',
              tootipText: 'Opção para abrir o form de configuração',
              coreAsWell: true,
              onClickFunction: function () {
                console.log('Click configuração');
              },
            },
        ]
    }

    static getContextMenuOptions(component: any) {
        return {
            evtType: 'cxttap',
            menuItems: this.createMenuItems(component),
            menuItemClasses: [],
            contextMenuClasses: [],
            submenuIndicador: {
                width: 12,
                height: 12
            }
        }
    }

}
