import { StepperCacheService } from './../task-form/stepper-cache.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CytoscapeService } from './cytoscape.service';
import { TaskService } from '../task-form/task.service';
import cytoscape from 'cytoscape';
import contextMenus from 'cytoscape-context-menus';
import { CommonModule } from '@angular/common';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import { ContextMenuConfig } from './contexto-menu-config';


cytoscape.use(contextMenus);
cytoscape.warnings(true);

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, ],
  template: `<div #cyContainer style="width: 100%; height: 100%;"></div>`,
  styleUrl: './graph.component.css'
})
export class GraphComponent implements OnInit, AfterViewInit {

  @ViewChild('cyContainer', { static: true })
  cytoscapeContainer!: ElementRef<HTMLDivElement>;

  private taskSubscription: Subscription = new Subscription();
  private taskFormReceivedData: any;
  private cy!: cytoscape.Core;
  private options = ContextMenuConfig.getContextMenuOptions(this);
  private isWaitingForEdges = true;

  showTaskForm: boolean = true;
  selectedElementId: string = '';

  constructor(
    private taskService: TaskService,
    private cytoscapeService: CytoscapeService,
    private stepperCacheService: StepperCacheService) {}


  ngOnInit(): void {
    console.log(' Graph works!', this.cytoscapeContainer);

    this.taskSubscription = this.taskService.data$.subscribe(data => {
      this.taskFormReceivedData = data;
    });
  }

  ngAfterViewInit(): void {
    this.initCytoscape();
    this.waitForEdgeClick();
  }

  private initCytoscape() {
    this.cy = cytoscape({
      container: this.cytoscapeContainer.nativeElement,
      elements: {
        nodes: [
          {
            group: 'nodes',
            data: { id: '0' },
            scratch: {
              _fluxo: 'initial_fluxo' // contexto de excucao de app fields
            },
            position: { x: 750, y: 100 },
            selected: true,
            selectable: true,
            locked: true,
            grabbable: true,
            classes: ['fluxo', 'start'],
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
        edges: []
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
          style: {
            'line-style': 'dotted',
          }
        },
        {
          selector: 'edge.dashed',
          style: {
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
    let collection = this.cy.collection();

    this.cy.on('tap', 'node', (event) => {
      const node = event.target;

      collection.union(node);
      this.cytoscapeService.setNoElemento(node);
      this.showForm(node.id());

      console.log('Node atual: ', node);
      console.log('Collection: ', collection);
      console.log('Selector Class: ', this.cy.elements('.task-node'));
    });
  }

  private async waitForEdgeClick() {
    try {
      while (this.isWaitingForEdges) {
        const event: any =  await this.cy.promiseOn('tap', 'edge');
        console.log('Edge Clicada: ', event.target);

        this.processEdgeClicked(event.target);
      }
    } catch(error) {
      console.error('Erro: ', error);
    }
  }

  private processEdgeClicked(edge: any) {
    const edgeId = edge.id();
    const sourceId = edge.source().id();
    const targerId = edge.target().id();

    console.log('Process Edge: ', edgeId, `${sourceId} -> ${targerId}`);
  }

  private stopWaitingForEdge() {
    this.isWaitingForEdges = false;
  }

  private startWaintingForEdge() {
    if (!this.isWaitingForEdges) {
      this.isWaitingForEdges = true;
      this.waitForEdgeClick();
    }
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
    console.log('Adiconando elemento: ', event);
    console.log('Stepper Atual: ', this.stepperCacheService.getCurrentStep());


    const clickedElement = event.target || event.cyTarget;
    const elementId = clickedElement.id();
    const newNodeId = `${classes.nodeClasses}-` + Date.now();
    const nodePos = clickedElement.position();
    console.log('Classe do node: ', classes.nodeClasses);


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
        scratch: { _fluxo: newNodeId },
        renderedPosition: { x: nodePos.x - 100, y: nodePos.y + 50 },
        classes: [classes.nodeClasses],
        // style: style ? style: null
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
    console.log('Node adicionado: ', this.cy.getElementById(newNodeId));

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

  ngOnDestroy(): void {
    this.stopWaitingForEdge();
    console.log('Nao escutando mais por edges');

  }

}
