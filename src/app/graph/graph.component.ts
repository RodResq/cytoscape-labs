import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import cytoscape from 'cytoscape';
import contextMenus from 'cytoscape-context-menus';
import { FluxoService } from '../fluxo/fluxo-form/fluxo.service';
import { NodeService } from '../fluxo/node-form/node.service';
import { FormsDataService } from '../shared/services/forms-data.service';
import { GrafoFormData, GrafoService } from '../shared/services/grafo.service';
import { StepperService } from './../cytoscape/stepper/stepper.service';
import { ContextMenuConfig } from './contexto-menu-config';
import { cytoscapeStyles } from './cytoscape-styles';
import { StepperCacheService, StepperData } from '../cytoscape/stepper/stepper-cache.service';
import { FormGroup } from '@angular/forms';


interface DadosFluxo {
  fluxo: string;
  descricao: string;
  dataCriacao: string;
}

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
  private stepperCacheService = inject(StepperCacheService);
  private nodeService = inject(NodeService)
  private formsDataService = inject(FormsDataService);
  private grafoService = inject(GrafoService);
  private fluxoService = inject(FluxoService);
  private router = inject(Router);

  private taskFormReceivedData: any;
  private cy!: cytoscape.Core;
  private options = ContextMenuConfig.getContextMenuOptions(this);
  private isWaitingForEdges = true;

  showNodeForm: boolean = true;
  selectedElementId: string = '';

  private contexMenuInstance!: contextMenus.ContextMenu;
  private grafo: GrafoFormData | null = null;

  constructor() {
    effect(() => {
      this.grafo = this.grafoService.getGrafo();
      const currentStepper = this.stepperService.getCurrentStep();

      const formCadastroFluxo = this.formsDataService.getFormByStep('step0');
      const dadosStorage = localStorage.getItem('step0');
      const dadosSalvoStorage: DadosFluxo | null = dadosStorage ? JSON.parse(dadosStorage): null
      
      if (!dadosSalvoStorage) {
        if (currentStepper == 0 && formCadastroFluxo && this.grafo?.node.id() == '0') {
          const formValue = formCadastroFluxo.value;
          if (formValue && this.cy) {
  
            if (this.grafo?.collection.length == 1) {
              this.grafo.node.select();
              this.grafo.node.style('label', formValue.fluxo);
            }
          }
        }
  
        const formSetupNode = this.formsDataService.getFormByStep('step1');
  
        if (currentStepper == 1 && formSetupNode && this.grafo?.node.id() != '1') {
          const formSetupNodeValue = formSetupNode.value;
          if (formSetupNodeValue && this.cy) {
            this.grafo?.node.select();
            this.grafo?.node.style('label', formSetupNodeValue.nome);
          }
        }
      } else {
        this.grafo?.node.select();
        this.grafo?.node.style('label', dadosSalvoStorage.fluxo);
      }



    });

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
    this.cy = cytoscape(this.addStartNode());

    this.contexMenuInstance = this.cy.contextMenus(this.options);

    let collection = this.cy.collection();

    this.waitForNodeClick(collection);

    this.grafoService.setGrafo({
      length: 1,
      node: this.cy.getElementById('0'),
      form: {},
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
      style: cytoscapeStyles,
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
    };
  }

  private waitForNodeClick(collection: cytoscape.CollectionReturnValue) {
    this.cy.on('tap', 'node', (event) => {
      const node = event.target;

      if (node.isNode()) {
        collection.union(node);
        this.nodeService.getELement(node);
        
        // TODO Recuperar Stepe dinamicamenta para setar como um propriedade do no.
        console.log('NodeId Clicado: ', node.id());
        const dadosFormLocalStorage = localStorage.getItem('step0');

        if (dadosFormLocalStorage) {
          
          this.grafoService.setGrafo({
            length: collection.length,
            node: node,
            collection: collection,
            form: dadosFormLocalStorage, 
            visible: true
          });
  
          switch (node.id()) {
            case '0':
              this.stepperService.setStepperByIndex(0);
              this.router.navigate(['/fluxoApp/fluxo'])
              break;
            default:
              this.stepperService.setStepperByIndex(1);
              this.fluxoService.openForm(1, 'Editar Tarefa', node.id());
              this.router.navigate(['/fluxoApp/node'])
              break;
          }
        } else {
          console.error('Dados do form no local storage não foi encontrado!');
          
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
    this.fluxoService.openForm(2, 'Node Geral', 'Info Node');

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
    console.log('Stepper Atual: ', this.stepperService.getCurrentStep());

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
        data: { id: newNodeId, idParentNode: elementId, form: {} },
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
    console.log('Nao escutando mais por edges');

  }

}
