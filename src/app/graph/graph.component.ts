import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, inject, OnInit, untracked, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import cytoscape from 'cytoscape';
import contextMenus from 'cytoscape-context-menus';
import { NodeService } from '../fluxo/node-form/node.service';
import { StepperService } from './../cytoscape/stepper/stepper.service';
import { ContextMenuConfig } from './contexto-menu-config';
import { cytoscapeStyles } from './cytoscape-styles';
import { GrafoFormData, TaskNode } from '@shared/types/graph.types';
import { FormsDataService } from '@shared/services/forms-data.service';
import { GrafoService } from '@shared/services/grafo.service';
import { FluxoFormData } from '@shared/types/form.types';
import { FormGroup } from '@angular/forms';
import { GraphReloadService } from '@shared/services/graph-reload.service';

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

  private cytoscapeContainer = viewChild.required<ElementRef<HTMLDivElement>>('cyContainer');
  private stepperService = inject(StepperService);
  private nodeService = inject(NodeService)
  private formsDataService = inject(FormsDataService);
  private grafoService = inject(GrafoService);
  private router = inject(Router);

  private taskFormReceivedData: any;
  private cy!: cytoscape.Core;
  private options = ContextMenuConfig.getContextMenuOptions(this);
  private isWaitingForEdges = true;
  private contexMenuInstance!: contextMenus.ContextMenu;
  private grafo!: GrafoFormData | null;
  private currentStep:number = 0;
  private dadosSalvoStorage!: FluxoFormData | null;
  private graphReloadService = inject(GraphReloadService);
  private reloadSubscription?: any;

  showNodeForm: boolean = true;
  selectedElementId: string = '';

  constructor() {
    effect(() => {
      this.grafo = this.grafoService.getGrafo();
      this.currentStep = untracked(() => this.stepperService.getCurrentStep());

      const grafoNodeData = this.grafo?.node.data();

      if (!grafoNodeData) {
          return;
      }

      if (this.currentStep == 0) {
        this.graphoFluxFormIteraction();
      } else if (this.currentStep == 1) {
        this.grafoTaskFormIteraction();
      } else  {
        return;
      }
    });
  }

  ngOnInit(): void {
    const dadosStorage = localStorage.getItem('step0');
    if (dadosStorage != undefined) {
      this.dadosSalvoStorage = dadosStorage ? JSON.parse(dadosStorage): null;

      if (this.dadosSalvoStorage) {
        this.grafo?.node.select();
        this.grafo?.node.style('label', this.dadosSalvoStorage.fluxo);
        return;
      }
    }

    this.reloadSubscription = this.graphReloadService.reload$.subscribe(() => {
      this.loadImportedGraph();
    });
  }

  ngAfterViewInit(): void {
    this.initCytoscape();
    setTimeout(() => {
      this.loadImportedGraph();
    }, 0);
    this.waitForEdgeClick();
    this.waitForRightClick();
  }

  private loadImportedGraph() {
    const importedData = localStorage.getItem('importedGraph');

    if (!importedData) {
      return;
    }

    try {
      const { nodes, edges } = JSON.parse(importedData);

      const startNode = this.cy.getElementById('0');
      if (startNode.length > 0) {
        console.log('Removendo nó inicial padrão');
        startNode.remove();
      }

      const elementsToAdd = [...nodes, ...edges];
      console.log('Elementos para gerar o grafo:', elementsToAdd);

      this.cy.add(elementsToAdd);

      this.cy.nodes().forEach(node => {
        console.log(`Nó: ${node.id()} - classes: ${node.classes()}`);
      });

      this.cy.edges().forEach(edge => {
        console.log(`Edge: ${edge.id()} - ${edge.source().id()} -> ${edge.target().id()}`);
      });

      setTimeout(() => {
        const layout = this.cy.layout({
          name: 'breadthfirst',
          directed: true,
          padding: 50,
          spacingFactor: 1,
          animate: true,
          animationDuration: 500
        });

        layout.run();
        layout.one('layoutstop', () => {
          this.cy.fit(undefined, 50);
        })
      }, 100);

      localStorage.removeItem('importedGraph');

    } catch(error) {
      console.error('Erro ao carregar grafo importado:', error)
    }
  }

  private graphoFluxFormIteraction() {
    const formCadastroFluxo = this.formsDataService.getFormByStep('step0');

    if (formCadastroFluxo && this.grafo?.node.id() == '0') {
      const formValue = formCadastroFluxo.value;
      if (formValue) {
          this.grafo.node.select();
          this.grafo.node.style('label', formValue.fluxo);
      }
    }
    return;
  }

  private grafoTaskFormIteraction() {
    const dadosStorage = localStorage.getItem('step1');
    const taskArray: TaskNode[] = dadosStorage ? JSON.parse(dadosStorage): [];
    const formSetupNode = this.formsDataService.getFormByStep('step1');
    const formTaskValue = formSetupNode ? formSetupNode.value: undefined

    if (!formTaskValue) return

    this.grafo?.node.select();

    if (taskArray.length > 0) {
      const nodeSalvoNoStorage = taskArray.find(dd => dd.id == this.grafo?.node.id());
      if (!nodeSalvoNoStorage) {
        this.grafo?.node.style('label', formTaskValue.nome);
      } else {
        this.grafo?.node.style('label', nodeSalvoNoStorage.form.nome);
      }
    } else {
        this.grafo?.node.style('label', formTaskValue.nome);
    }
    return;
  }

  private initCytoscape() {
    this.cy = cytoscape(this.addStartNode());

    this.contexMenuInstance = this.cy.contextMenus(this.options);

    this.grafoService.setGrafo({
      length: 1,
      node: this.cy.getElementById('0'),
      form: new FormGroup({}),
      collection: this.cy.nodes(),
      visible: false
    });
  }

  private addStartNode(): cytoscape.CytoscapeOptions | undefined {
    return {
      container: this.cytoscapeContainer().nativeElement,
      elements: {
        nodes: [
          {
            group: 'nodes',
            data: {
              id: '0',
              label: 'Start'
            },
            scratch: {
              _fluxo: 'initial_fluxo'
            },
            position: { x: 150, y: 150 },
            selected: false,
            selectable: true,
            locked: false,
            grabbable: true,
            classes: ['fluxo', 'start']
          },
        ],
        edges: []
      },
      style: cytoscapeStyles,
      layout: {
        name: 'preset',
        padding: 50
      },
      zoom: 1,
      pan: { x: 0, y: 0 },
      minZoom: 0.5,
      maxZoom: 0.80,
      zoomingEnabled: true,
      userZoomingEnabled: true,
      panningEnabled: true,
      userPanningEnabled: true
    };
  }

  private waitForRightClick() {
    this.cy.on('cxttap', 'node', (event) => {
      const node = event.target;

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

  private async waitForEdgeClick() {
    try {
      while (this.isWaitingForEdges) {
        const event: any =  await this.cy.promiseOn('tap', 'edge');
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

  private stopWaitingForEdge() {
    this.isWaitingForEdges = false;
  }

  private startWaintingForEdge() {
    if (!this.isWaitingForEdges) {
      this.isWaitingForEdges = true;
      this.waitForEdgeClick();
    }
  }

  private metadata(event: any) {
    const node = event.target || event.cyTarget;
    this.cy.nodes().unselect();

    if (!node.isNode()) {
      console.log('Elemento clicado nao e um no.');
      return;
    }

    const selectedNode = node.select();
    console.log('No selecionado: ', selectedNode);

    this.nodeService.getELement(node);
  }

  private editNode(event: any) {
    const node = event.target || event.cyTarget;
    this.cy.nodes().unselect();

    if (node.isNode()) {
      node.select();
      this.nodeService.getELement(node);

      this.grafoService.setGrafo({
        length: this.cy.collection().length,
        node: node,
        collection: this.cy.collection(),
        form: new FormGroup({}),
        visible: true
      });

      switch (node.id()) {
        case '0':
          this.stepperService.setStepperByIndex(0);
          this.router.navigate(['/fluxoApp/fluxo'], {queryParams: {id:node.id()}})
          break;
        default:
          this.stepperService.setStepperByIndex(1);
          this.router.navigate(['/fluxoApp/node'], {queryParams: {id: node.id()}})
          break;
      }
    }
  }

  private removerElemento(event: any) {
    const clickedElement = event.target || event.cyTarget;
    const elementId = clickedElement.id();

    if (this.hasChildren(elementId)) {
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
    const clickedElement = event.target || event.cyTarget;
    const elementId = clickedElement.id();
    const newNodeId = `${classes.nodeClasses}-` + Date.now();
    const nodePos = clickedElement.position();

    const existingChildren = this.cy.nodes().filter((node: any) => {
      return node.data('idParentNode') === elementId;
    })

    const childOffset = existingChildren.length * 150;

    const offsetX = 120 + childOffset;
    const offsetY = 80;

    const newPosition = {
      x: nodePos.x + offsetX,
      y: nodePos.y + offsetY
    }

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
        data: { id: newNodeId, idParentNode: elementId, form: {} },
        scratch: { _fluxo: newNodeId },
        position: newPosition,
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

    this.cy.animate({
      fit: {
        eles: this.cy.elements(),
        padding: 30,
      },
      duration: 300
    });

    this.grafoService.setGrafo({
      length: this.cy.nodes().length,
      node: nodeAdicionado,
      form: new FormGroup({}),
      collection: this.cy.nodes(),
      visible: false
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
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe()
    }
  }

}
