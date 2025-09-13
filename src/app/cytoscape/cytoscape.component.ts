import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import cytoscape from 'cytoscape';
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import { TaskFormComponent } from "../task-form/task-form.component";
import { CommonModule } from '@angular/common';
import { TaskService } from '../task-form/task.service';
import { Subscription } from 'rxjs';
import { CytoscapeService } from './cytoscape.service';

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
          id: 'add-note-decisão',
          content: 'Adicionar nó de decisão',
          tooltipText: 'Adcione um nó de decisão no fluxo',
          selector: 'node, edge',
          onClickFunction:  (event: any) => {
            this.adicionarNoDeDecicao(event);
          },
          disabled: false
        },
        {
          id: 'add-node',
          content: 'Adicionar Nó de Tarefa',
          tooltipText: 'Adicionar um nó para tarefa no fluxo',
          image: {src : "assets/icons/add.svg", width : 12, height : 12, x : 6, y : 4},
          selector: 'node',
          coreAsWell: true,
          onClickFunction: (event: any) => {
            this.adicionarNoDeTarefa(event);
          }
        },
        {
          id: 'add-node-ssitema',
          content: 'Adcionar nó de sistema',
          tooltipText: 'Adicionar um nó que representa o sitema com um todo',
          selector: 'node, edge',
          onClickFunction:  (event: any) => {
            this.adicionarNoDeSistema(event);
          },
          disabled: false
        },
        {
          id: 'add-node-final',
          content: 'Adcionar nó de final',
          tooltipText: 'Adicionar um nó final',
          selector: 'node, edge',
          onClickFunction:  (event: any) => {
            this.adicionarNoFinal(event);
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
              'background-color': '#f8fafc', // Cor de fundo da tela (mesmo do main-content)
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
          selector: 'node',
          style: {
            // 'background-color': '#0074D9',
            'text-valign': 'bottom',
            label: 'data(id)'
          }
        },
        {
          selector: 'end-node',
          style: {
            // 'background-color': '#FF4136',
            'text-valign': 'bottom',
            label: 'data(id)'
          }
        },
        {
          selector: '.triangle-node',
          style: {
            'shape': 'triangle',
            // 'background-color': '#FF4136',
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
            // 'background-color': '#FF4136',
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
            'shape': 'round-diamond',
            // 'background-color': '#FFDC00',
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
            // 'background-color': '#FFDC00',
            'width': 40,
            'height': 40,
            label: 'data(id)',
            'text-valign': 'bottom',
            'text-halign': 'center'
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
            'curve-style': 'bezier'
          }
        },
        {
          selector: 'edge.dotted',
          style : {
            'line-style': 'dotted',
            'line-color': '#009966',
            'target-arrow-color': '#009966'
          }
        },
        {
          selector: 'edge.dashed',
          style : {
            'line-style': 'dashed',
            'line-color': '#ee3f4eff',
            'target-arrow-color': '#ee3f4eff'
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


  private adicionarNoDeTarefa(event: any) {
    const clickedElement = event.target || event.cyTarget;
    const elementId = clickedElement.id();

    const newNodeId = 'tarefa-' + Date.now();

    const nodePos = clickedElement.position();

    this.cy.add([
      {
        group: 'nodes',
        data: { id: newNodeId, idParentNode: elementId },
        position: { x: nodePos.x + 100, y: nodePos.y + 50 },
        classes: 'node',
      },
      {
        group: 'edges',
        style: {'background-color': '#FFDC00',},
        data: {
          id: 'edge-' + elementId + '-' + newNodeId,
          source: elementId,
          target: newNodeId,
        }
      }
    ]);

    const newNode = this.cy.getElementById(newNodeId);
    this.cytoscapeService.setNoElemento(newNode);
  }

  private adicionarNoDeDecicao(event: any) {
    const clickedElement = event.target || event.cyTarget;
    const elementId = clickedElement.id();
    const newNodeId = 'decisao-' + Date.now();
    const nodePos = clickedElement.position();

    this.cy.add([
      {
        group: 'nodes',
        data: { id: newNodeId, idParentNode: elementId,  },
        position: { x: nodePos.x - 100, y: nodePos.y + 50 },
        classes: 'decision-node'
      },
      {
        group: 'edges',
        data: {
          id: 'edge-' + elementId + '-' + newNodeId,
          source: elementId,
          target: newNodeId
        },
        classes: 'dashed'
      }
    ]);

    const newNode = this.cy.getElementById(newNodeId);
    console.log('Novo no criado: ', newNode);
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
    // TODO Armazenar Informações no próprio Nó.
  }

  private adicionarNoDeSistema(event: any) {
    const clickedElement = event.target || event.cyTarget;
    const elementId = clickedElement.id();
    const newNodeId = 'sistema-' + Date.now();
    const nodePos = clickedElement.position();

    this.cy.add([
      {
        group: 'nodes',
        data: { id: newNodeId, idParentNode: elementId,  },
        position: { x: nodePos.x - 100, y: nodePos.y + 50 },
        classes: 'system-node'
      },
      {
        group: 'edges',
        data: {
          id: 'edge-' + elementId + '-' + newNodeId,
          source: elementId,
          target: newNodeId
        },
        classes: 'dotted'
      }
    ]);

    const newNode = this.cy.getElementById(newNodeId);
    console.log('Novo no criado: ', newNode);
  }

  private adicionarNoFinal(event: any) {
    const clickedElement = event.target || event.cyTarget;
    const elementId = clickedElement.id();
    const newNodeId = 'final-' + Date.now();
    const nodePos = clickedElement.position();

    this.cy.add([
      {
        group: 'nodes',
        data: { id: newNodeId, idParentNode: elementId,  },
        position: { x: nodePos.x - 100, y: nodePos.y + 50 },
        classes: 'end-node',
        style: { 'background-color': 'black' }
      },
      {
        group: 'edges',
        data: {
          id: 'edge-' + elementId + '-' + newNodeId,
          source: elementId,
          target: newNodeId
        },
        classes: 'dotted'
      }
    ]);

    const newNode = this.cy.getElementById(newNodeId);
    console.log('Novo no criado: ', newNode);
  }


}
