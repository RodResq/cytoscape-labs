import { StepperCacheService } from '../cytoscape/stepper/stepper-cache.service';
import { AfterViewInit, Component, effect, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import cytoscape from 'cytoscape';
import contextMenus from 'cytoscape-context-menus';
import { CommonModule } from '@angular/common';
import { ContextMenuConfig } from './contexto-menu-config';
import { NodeService } from '../fluxo/node-form/node.service';
import { FormsDataService } from '../services/forms-data.service';
import { GrafoService } from '../services/grafo.service';
import { FluxoService } from '../fluxo/fluxo-form/fluxo.service';


cytoscape.use(contextMenus);
cytoscape.warnings(true);

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, ],
  template: `<div #cyContainer></div>`,
  styleUrl: './graph.component.css'
})
export class GraphComponent implements OnInit, AfterViewInit {

  @ViewChild('cyContainer', { static: true })
  cytoscapeContainer!: ElementRef<HTMLDivElement>;
  private stepperCacheService = inject(StepperCacheService);
  private nodeService = inject(NodeService)
  private formsDataService = inject(FormsDataService);
  private grafoService = inject(GrafoService);
  private fluxoService = inject(FluxoService);

  private taskFormReceivedData: any;
  private cy!: cytoscape.Core;
  private options = ContextMenuConfig.getContextMenuOptions(this);
  private isWaitingForEdges = true;

  showNodeForm: boolean = true;
  selectedElementId: string = '';

  private contexMenuInstance!: contextMenus.ContextMenu;

  constructor() {
    effect(() => {
      const grafo = this.grafoService.getGrafo();
      const formStep1 = this.formsDataService.getFormByStep('step1');

      if (formStep1) {
        const formValue = formStep1.value;
        if (formValue && this.cy) {

          if (grafo?.collection.length == 1) {
            grafo.node.select();
            grafo.node.style('label', formValue.codigoFluxo);
          }
        }
      }

      const formSetupNode = this.formsDataService.getFormByStep('step2');
      if (formSetupNode) {
        const formSetupNodeValue = formSetupNode.value;
        if (formSetupNodeValue && this.cy) {
          grafo?.node.select();
          grafo?.node.style('label', formSetupNodeValue.nome);
        }
      }

    }, { allowSignalWrites: true });
    
  }

  ngOnInit(): void {
    console.log(' Graph works!', this.cytoscapeContainer);
  }

  ngAfterViewInit(): void {
    this.initCytoscape();
    this.waitForEdgeClick();
    this.waitForRightClick();
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
            position: { x: 900, y: 100 },
            selected: false,
            selectable: true,
            locked: true,
            grabbable: true,
            classes: ['fluxo', 'start'],
            style: {
              'text-valign': 'top',
              'shape': 'ellipse',
              // 'background-color': '#f8fafc',
              'border-width': 5,
              'border-color': 'silver',
              'border-style': 'solid',
              label: 'Initial Node'
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

    this.contexMenuInstance = this.cy.contextMenus(this.options);


    let collection = this.cy.collection();

    this.waitForNodeClick(collection);

    this.grafoService.setGrafo({
      length: 1,
      node: this.cy.getElementById('0'),
      form: {},
      collection: this.cy.nodes()
    });
  }

  private waitForNodeClick(collection: cytoscape.CollectionReturnValue) {
    this.cy.on('tap', 'node', (event) => {
      const node = event.target;

      if (node.isNode()) {
        collection.union(node);
        this.nodeService.getELement(node);
        console.log('NodeId atual: ', node.id());
        this.grafoService.setGrafo({
          length: collection.length,
          node: node,
          collection: collection,
          form: {},
        });
        const idNode = node.id();
        switch (idNode) {
          case '0':

            this.fluxoService.openForm(0);
            break;
          default:
            this.fluxoService.openForm(1);
            break;
        }
      } else {
        console.log('Elemento selecionado nao e um no');
      }
    });
  }

  private waitForRightClick() {
    this.cy.on('cxttap', 'node', (event) => {
      const node = event.target;

      console.log('Nó clicado: ', node.id());
      let menuItemRemoveNodeExist = this.menuItemExiste('remove-node');
      
      if (node && node.id() == '0') {
        if (menuItemRemoveNodeExist) {
          this.contexMenuInstance.removeMenuItem('remove-node');
        }
        
        let menuItemTesteExist = this.menuItemExiste('teste-menu-dinamico');
        if (!menuItemTesteExist) {
          this.addMenuItemTest();
        }
      } else if(node && String(node.id()).includes('end-node')) {
        let menuItemAddNodeExist = this.menuItemExiste('add-node');
        console.log('menuItemAddNodeExist: ', menuItemAddNodeExist);
        
        if (menuItemAddNodeExist) {
          this.contexMenuInstance.removeMenuItem('add-node');
        } 
        this.appendMenuItem();
      } else {
        if (!menuItemRemoveNodeExist) {
          this.addMenuItemRemoveNode();
        }
      }
    });
  }

  private appendMenuItem() {
    this.contexMenuInstance.appendMenuItem({
      id: 'remove-node',
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
        this.removerElemento(event);
      },
      disabled: false,
      show: true,
      hasTrailingDivider: true,
      coreAsWell: false
    }
    );
  }

  private addMenuItemRemoveNode() {
    this.contexMenuInstance.insertBeforeMenuItem({
      id: 'remove-node',
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
        this.removerElemento(event);
      },
      disabled: false,
      show: true,
      hasTrailingDivider: true,
      coreAsWell: false
    }, 'add-node');
  }

  private addMenuItemTest() {
    this.contexMenuInstance.appendMenuItem({
      id: 'teste-menu-dinamico',
      content: 'Destacar',
      selector: 'node',
      onClickFunction: (event) => {
        const target = event.target || event.cy;
        target.style('background-color', 'yellow');
      }
    });
  }

  private menuItemExiste(menuItem: string): boolean {
    let menuItemRemoveNodeExiste = false;
    try {
      this.contexMenuInstance.showMenuItem(menuItem);
      menuItemRemoveNodeExiste = true;
    } catch (error) {
      menuItemRemoveNodeExiste = false;
    }
    return menuItemRemoveNodeExiste;
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
    this.showNodeForm = true;
  }

  private hideForm(): void {
    this.showNodeForm = false;
    this.selectedElementId = '';
  }

  private toggleForm(): void {
    this.showNodeForm = !this.showNodeForm;
  }

  recuperarDadosForm(event: any) {
    console.log('Dados do formulário: ', this.taskFormReceivedData);
  }


  private addNode(event: any, classes: any, position: {x: number, y: number}, style?: {}) {
    console.log('Adiconando elemento: ', event);
    console.log('Stepper Atual: ', this.stepperCacheService.getCurrentStep());

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
        scratch: { _fluxo: newNodeId },
        renderedPosition: { x: nodePos.x - position.x, y: nodePos.y + position.y },
        classes: [classes.nodeClasses],
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
    this.cy.nodes().unselect();
    const nodeAdicionado =  this.cy.getElementById(newNodeId);

    this.grafoService.setGrafo({
      length: this.cy.nodes().length,
      node: nodeAdicionado,
      form: {},
      collection: this.cy.nodes()
    });
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
