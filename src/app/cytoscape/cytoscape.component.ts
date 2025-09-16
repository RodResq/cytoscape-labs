import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import cytoscape from 'cytoscape';
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import { Subscription } from 'rxjs';
import { TaskFormComponent } from "../task-form/task-form.component";
import { TaskService } from '../task-form/task.service';
import { CytoscapeService } from './cytoscape.service';
import { ContextMenuConfig } from './contexto-menu-config';


cytoscape.use(contextMenus);

@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css'],
  imports: [TaskFormComponent, CommonModule],
})
export class CytoscapeComponent implements OnInit {
  @ViewChild('cyContainer', { static: true })
  cytoscapeContainer!: ElementRef;

  private taskSubscription: Subscription = new Subscription();
  private taskFormReceivedData: any;

  showTaskForm: boolean = true;
  selectedElementId: string = '';

  private cy!: cytoscape.Core;
  private options = ContextMenuConfig.getContextMenuOptions(this);

  /**
  private options = {
      evtType: 'cxttap',
      menuItems: [
        {
          id: 'Remove Nó',
          content: 'remove',
          tooltipText: 'remove',
          image: {src : "assets/icons/remove.svg", width : 12, height : 12, x : 6, y : 4},
          selector: 'node, edge',
          onClickFunction: (event: any) => {
            this.removerElemento(event);
          },
          disabled: false,
          show: true,
          hasTrailingDivider: true,
          coreAsWell: false
        },
        {
          id: 'add-node',
          content: 'Adicionar Nó de Tarefa',
          tooltipText: 'Adicionar um nó para tarefa no fluxo',
          image: {src : "assets/icons/add.svg", width : 12, height : 12, x : 6, y : 4},
          selector: 'node',
          coreAsWell: true,
          onClickFunction: (event: any) => {
            const classes = {nodeClasses: 'task-node', edgeClasses: 'null'};
            this.addNode(event, classes, null);
          }
        },
        {
          id: 'add-note-decisão',
          content: 'Adicionar nó de decisão',
          tooltipText: 'Adcione um nó de decisão no fluxo',
          selector: 'node, edge',
          onClickFunction:  (event: any) => {
            const classes = {nodeClasses: 'decision-node', edgeClasses: 'dashed'};
            this.addNode(event, classes, null);
          },
          disabled: false
        },
        {
          id: 'add-node-ssitema',
          content: 'Adcionar nó de sistema',
          tooltipText: 'Adicionar um nó que representa o sitema com um todo',
          selector: 'node, edge',
          onClickFunction:  (event: any) => {
            const classes = {nodeClasses: 'system-node', edgeClasses: 'dotted'};
            this.addNode(event, classes, null);
          },
          disabled: false
        },
        {
          id: 'add-node-separation',
          content: 'Adcionar nó de separacao',
          tooltipText: 'Adicionar um nó que representa separacao no fluxo',
          selector: 'node, edge',
          onClickFunction:  (event: any) => {
            const classes = {nodeClasses: 'separation-node', edgeClasses: 'null'};
            this.addNode(event, classes, null);
          },
          disabled: false
        },
        {
          id: 'add-node-join',
          content: 'Adcionar nó de juncao',
          tooltipText: 'Adicionar um nó que representa juncao no fluxo',
          selector: 'node, edge',
          onClickFunction:  (event: any) => {
            const classes = {nodeClasses: 'join-node', edgeClasses: 'null'};
            this.addNode(event, classes, null);
          },
          disabled: false
        },
        {
          id: 'add-node-nachr',
          content: 'Adicionar nó sub-processo',
          tooltipText: 'Adicionar um nó que representa um subprocesso',
          selector: 'node, edge',
          onClickFunction:  (event: any) => {
            const classes = {nodeClasses: 'subprocess-node', edgeClasses: 'null'};
            this.addNode(event, classes, null);
          },
          disabled: false
        },
        {
          id: 'add-node-final',
          content: 'Adcionar nó de final',
          tooltipText: 'Adicionar um nó final',
          selector: 'node, edge',
          onClickFunction:  (event: any) => {
            const classes = {nodeClasses: 'end-node', edgeClasses: 'dotted'};
            const style = { 'background-color': 'black' };

            this.addNode(event, classes, style);
          },
          disabled: false
        }
      ],
      menuItemClasses: [
      ],
      contextMenuClasses: [
      ],
      submenuIndicator: { src: 'assets/icons/submenu-indicator-default.svg', width: 12, height: 12 }
  }; 
  */

  constructor(
    private taskService: TaskService,
    private cytoscapeService: CytoscapeService) {}

  ngOnInit(): void {
    this.taskSubscription = this.taskService.data$.subscribe(data => {
      this.taskFormReceivedData = data;
    });
    this.cy = cytoscape({
      container: this.cytoscapeContainer.nativeElement,
      elements: {
        nodes: [
          {
            data: { id: '0' },
            position: {x: 100, y: 100},
            style: {
              'text-valign': 'top',
              'shape': 'ellipse',
              'background-color': '#f8fafc',
              'border-width': 5,
              'border-color': 'silver',
              'border-style': 'solid'
            }
          },
        ],
        edges: [
        ]
      },
      style: [
        {
          selector: 'task-node',
          style: {
            'text-valign': 'bottom',
            label: 'data(id)'
          }
        },
        {
          selector: 'end-node',
          style: {
            'text-valign': 'bottom',
            label: 'data(id)'
          }
        },
        {
          selector: '.triangle-node',
          style: {
            'shape': 'triangle',
            'width': 30,
            'height': 30,
            label: 'data(id)',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        },
        {
          selector: '.event-node',
          style: {
            'shape': 'triangle',
            'width': 30,
            'height': 30,
            label: 'data(id)',
            'text-valign': 'bottom',
            'text-halign': 'left'
          }
        },
        {
          selector: '.decision-node',
          style: {
            'shape': 'diamond',
            'width': 40,
            'height': 40,
            label: 'data(id)',
            'text-valign': 'bottom',
            'text-halign': 'center'
          }
        },
        {
          selector: '.system-node',
          style: {
            'shape': 'pentagon',
            'width': 40,
            'height': 40,
            label: 'data(id)',
            'text-valign': 'bottom',
            'text-halign': 'center'
          }
        },
        {
          selector: '.separation-node',
          style: {
            'shape': 'vee',
            'width': 40,
            'height': 40,
            label: 'data(id)',
            'text-valign': 'bottom',
            'text-halign': 'center'
          }
        },
        {
          "selector": ".join-node",
          style: {
            'shape': 'polygon',
            'shape-polygon-points': '-0.33 -1 0.33 -1 0.33 -0.33 1 -0.33 1 0.33 0.33 0.33 0.33 1 -0.33 1 -0.33 0.33 -1 0.33 -1 -0.33 -0.33 -0.33',
            label: 'data(id)',
            'width': 40,
            'height': 40,
            'text-valign': 'bottom',
            'text-halign': 'center'
          }
        },
        {
          selector: '.subprocess-node',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#E8F5E8',
            'width': 40,
            'height': 40,
             label: 'data(id)',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'font-family': 'Arial, sans-serif',
            'text-wrap': 'wrap',
            'text-max-width': '90px',
          }
        },
        {
          selector: '.subprocess-node.active',
          style: {
            'background-color': '#C8E6C9',
            'border-color': '#4CAF50',
          }
        },
        {
          selector: '.subprocess-node.blocked',
          style: {
            'background-color': '#FFEBEE',
            'border-color': '#F44336',
            'color': '#C62828',
            label: 'data(label)',
          }
        },
        {
          selector: 'edge',
          style: {
            'line-style': 'solid',
            'width': 1,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': '',
          }
        },
        {
          selector: 'edge.dotted',
          style : {
            'line-style': 'dotted',
          }
        },
        {
          selector: 'edge.dashed',
          style : {
            'line-style': 'dashed',
            'line-color': '#ee3f4eff',
            'target-arrow-color': '#ee3f4eff'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#ff6b6b'
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#ff6b6b',
            'target-arrow-color': '#ff6b6b',
            'width': 4
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1
      },
      zoom: 1,
      pan: { x: 0, y: 0 },
      minZoom: 1e-50,
      maxZoom: 1e50,
      zoomingEnabled: false,
      userZoomingEnabled: true,
    });

    this.cy.contextMenus(this.options);

    this.cy.on('tap', 'node', (event) => {
        const node = event.target;
        this.cytoscapeService.setNoElemento(node);
        this.showForm(node.id());
        console.log('Node atual: ', node);
    });

  }

  private removerElemento(event: any) {
    const clickedElement = event.target || event.cyTarget;
    const elementId = clickedElement.id();

    console.log('No a ser removido', clickedElement);

    if (this.hasChildren(elementId)) {
      alert('Elemento nao pode ser removido pois possui elemento filhos');
      return;
    }

    clickedElement.remove();
  }

  private hasChildren(nodeId: string): boolean {
    const node = this.cy.getElementById(nodeId);
    const children = node.successors('node');

    return children.length > 0;
  }

  private showForm(idElemento: string): void {
    this.selectedElementId = idElemento;
    this.showTaskForm = true;
  }

  private hideForm(): void {
    this.showTaskForm = false;
    this.selectedElementId = '';
  }

  private toggleForm(): void {
    this.showTaskForm = !this.showTaskForm;
  }

  recuperarDadosForm(event: any) {
    console.log('Dados do formulário: ', this.taskFormReceivedData);
  }


  private addNode(event: any, classes: any, style: {} | null) {
    const clickedElement = event.target || event.cyTarget;
    const elementId = clickedElement.id();
    const newNodeId = `${classes.nodeClasses}-` + Date.now();
    const nodePos = clickedElement.position();

    const newNodeData: any = {
      id: newNodeId,
      idParentNode: elementId,
      label: this.getNodeLabel(classes.nodeClasses)
    };

    if (classes.nodeClasses === 'subprocess-node') {
      newNodeData.sbgnClass = 'macromolecule';
      newNodeData.label = newNodeId;
      newNodeData.clonemarker = false;
      newNodeData.stateVariables = [];
      newNodeData.unitsOfInformation = [{
        label: newNodeId,
        entity: {
          name: newNodeId,
          value: newNodeId
        }
      }];
    }

    this.cy.add([
      {
        group: 'nodes',
        data: { id: newNodeId, idParentNode: elementId,  },
        position: { x: nodePos.x - 100, y: nodePos.y + 50 },
        classes: classes.nodeClasses,
        style: style ? style: null
      },
      {
        group: 'edges',
        data: {
          id: 'edge-' + elementId + '-' + newNodeId,
          source: elementId,
          target: newNodeId,
          label: '',
        },
        classes: classes.edgeClasses
      }
    ]);
  }


  private getNodeLabel(nodeClass: string): string {
    const labels: { [key: string]: string } = {
      'task-node': 'Nova Tarefa',
      'decision-node': 'Decisão?',
      'system-node': 'Sistema',
      'separation-node': 'Separação',
      'join-node': 'Junção',
      'end-node': 'Fim',
      'subprocess-node': 'nAChR'
    };
    return labels[nodeClass] || 'Novo Nó';
  }

  activateSubProcessNode(nodeId: string): void {
    const node = this.cy.getElementById(nodeId);
    if (node.hasClass('subprocess-node')) {
      node.removeClass('blocked');
      node.addClass('active');
    }
  }

  blockSubProcessNode(nodeId: string): void {
    const node = this.cy.getElementById(nodeId);
    if (node.hasClass('subprocess-node')) {
      node.removeClass('active');
      node.addClass('blocked');
    }
  }

  resetSubProccessNode(nodeId: string): void {
    const node = this.cy.getElementById(nodeId);
    if (node.hasClass('subprocess-node')) {
      node.removeClass('active blocked');
    }
  }

}
