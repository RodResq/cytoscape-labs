import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, inject, OnInit, untracked, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
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
import { NodeXmlSelectionService } from '@shared/services/node-xml-selection.service';
import { XmlTemplateService } from '@shared/services/xml-template.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { XmlSnippetRepresentationService } from '@shared/services/xml-snippet-representation.service';
import { FormService } from '@shared/services/form.service';

cytoscape.use(dagre);
cytoscape.use(contextMenus);
cytoscape.warnings(true);

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, ToastModule],
  template: `<div #cyContainer></div><p-toast />`,
  styleUrl: './graph.component.css',
  providers: [MessageService]
})
export class GraphComponent implements OnInit, AfterViewInit {

  private cytoscapeContainer = viewChild.required<ElementRef<HTMLDivElement>>('cyContainer');
  private stepperService = inject(StepperService);
  private nodeService = inject(NodeService)
  private formsDataService = inject(FormsDataService);
  private grafoService = inject(GrafoService);
  private router = inject(Router);
  private nodeXmlSelectionService = inject(NodeXmlSelectionService);
  private xmlTemplateService = inject(XmlTemplateService);
  private messageService = inject(MessageService);
  private graphReloadService = inject(GraphReloadService);
  private xmlSnippetRepresentationService = inject(XmlSnippetRepresentationService);
  private formService = inject(FormService);

  private taskFormReceivedData: any;
  private cy!: cytoscape.Core;
  private options = ContextMenuConfig.getContextMenuOptions(this);
  private isWaitingForEdges = true;
  private contexMenuInstance!: contextMenus.ContextMenu;
  private grafo!: GrafoFormData | null;
  private currentStep: number = 0;
  private dadosSalvoStorage!: FluxoFormData | null;
  private reloadSubscription?: any;
  private clearSubscription?: any;

  showNodeForm: boolean = true;
  selectedElementId: string = '';

  constructor() {
    effect(() => {
      const form = this.formService.form();
      if (form) {
        console.log('Form recebido no graph component: ', form);
      }

      this.grafo = this.grafoService.getGrafo();
      this.currentStep = untracked(() => this.stepperService.getCurrentStep());

      const grafoNodeData = this.grafo?.node?.data?.();

      if (!grafoNodeData) {
        return;
      }

      if (this.currentStep == 0) {
        this.graphoFluxFormIteraction();
      } else if (this.currentStep == 1) {
        this.grafoTaskFormIteraction();
      } else {
        return;
      }

    });
  }

  ngOnInit(): void {
    const dadosStorage = localStorage.getItem('step0');
    if (dadosStorage != undefined) {
      this.dadosSalvoStorage = dadosStorage ? JSON.parse(dadosStorage) : null;

      if (this.dadosSalvoStorage) {
        this.grafo?.node.select();
        this.grafo?.node.style('label', this.dadosSalvoStorage.fluxo);
        return;
      }
    }

    this.reloadSubscription = this.graphReloadService.reload$.subscribe(() => {
      this.loadImportedGraph();
    });

    this.clearSubscription = this.graphReloadService.clear$.subscribe(() => {
      this.clearGraph();
    })
  }

  ngAfterViewInit(): void {
    this.initCytoscape();
    setTimeout(() => {
      this.loadImportedGraph();
    }, 100);
    this.waitForEdgeClick();
    this.waitForRightClick();

    this.cy.on('tap', 'node', (event) => {
      const node = event.target;
      const nodeType: string | undefined = node.data('type');
      const nodeId = node.id() as string;

      const nodeLabel: string =
        node.style('label') ||
        node.data('label') ||
        nodeId;

      const xmlSnippet: string | undefined = node.data('xmlSnippet');

      this.nodeXmlSelectionService.selectNodeInXml(nodeId, nodeLabel, xmlSnippet, nodeType);
    });
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
          name: 'dagre',
          rankDir: 'TB',
          nodeSep: 100,
          rankSep: 100,
          edgeSep: 10,
          padding: 50,
          animate: true,
          animationDuration: 500,
          fit: true
        } as cytoscape.DagreLayouteOptions);
        layout.run();
      }, 100);

      localStorage.removeItem('importedGraph');

    } catch (error) {
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
    const taskArray: TaskNode[] = dadosStorage ? JSON.parse(dadosStorage) : [];
    const formSetupNode = this.formsDataService.getFormByStep('step1');
    const formTaskValue = formSetupNode ? formSetupNode.value : undefined

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
    const xmlSnippet = this.xmlTemplateService.generateStartState();
    return {
      container: this.cytoscapeContainer().nativeElement,
      elements: {
        nodes: [
          {
            group: 'nodes',
            data: {
              id: 'start',
              label: 'start',
              xmlSnippet: xmlSnippet,
              xmlRepresentation: this.xmlSnippetRepresentationService.mapXmlSnippetToRepresentation(xmlSnippet)
            },
            scratch: {
              _fluxo: 'initial_fluxo'
            },
            position: { x: 150, y: 150 },
            selected: false,
            selectable: true,
            locked: false,
            grabbable: true,
            classes: ['start-state']
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

      try { this.contexMenuInstance.showMenuItem('remove-node'); } catch (e) { }
      try { this.contexMenuInstance.showMenuItem('add-node'); } catch (e) { }

      if (node && node.id() == '0') {
        try { this.contexMenuInstance.hideMenuItem('remove-node'); } catch (e) { }

        let menuItemTesteExist = this.menuItemExiste('teste-menu-dinamico');
        if (!menuItemTesteExist) {
          this.addMenuItemTest();
        }
      } else if (node && String(node.id())?.includes('end-node')) {
        try { this.contexMenuInstance.hideMenuItem('add-node'); } catch (e) { }
      }
    });
  }

  private async waitForEdgeClick() {
    try {
      while (this.isWaitingForEdges) {
        const event: any = await this.cy.promiseOn('tap', 'edge');
        this.processEdgeClicked(event.target);
      }
    } catch (error) {
      console.error('Erro: ', error);
    }
  }

  private processEdgeClicked(edge: any) {
    const edgeId = edge.id();
    const sourceId = edge.source().id();
    const targerId = edge.target().id();

    console.log('Process Edge: ', edgeId, `${sourceId} -> ${targerId}`);
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

  private editNode(event: cytoscape.EventObject) {
    const node: cytoscape.NodeSingular = event.target || event.cy;
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

      this.grafoService.editNode(node);
      this.stepperService.setStepperByIndex(1);
      this.router.navigate(['/fluxoApp/node'], { queryParams: { id: node.id() } })
    }
  }

  private removerElemento(event: any) {
    const clickedElement = event.target || event.cyTarget;
    const elementId = clickedElement.id();

    if (this.hasChildren(elementId)) {
      return;
    }

    clickedElement.remove();
    this.xmlTemplateService.triggerRemoveNode(elementId);
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

  private checkExistsNodeEnd(event: cytoscape.EventObject, classes: any) {
    if (classes.nodeClasses === 'end-node' && this.cy.nodes('.end-node').length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Ja existe um no de fim'
      });
      return true;
    }
    return false;
  }

  private generateRandomUUID() {
    return crypto.randomUUID().split('-')[0];
  }

  private addNode(event: cytoscape.EventObject, classes: any) {

    if (this.checkExistsNodeEnd(event, classes)) return;

    const clickedElement: cytoscape.NodeSingular = event.target || event.cy;
    const uuid = this.generateRandomUUID();
    const newNodeId = `${classes.nodeClasses}-${uuid}`;

    const existingChildren = this.cy.nodes().filter((node: cytoscape.NodeSingular) => {
      return node.data('idParentNode') === clickedElement.id();
    });

    let newPosition = this.calculateNewPosition(existingChildren, clickedElement);

    const newNodeData: any = {
      id: newNodeId,
      idParentNode: clickedElement.id(),
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
        data: { id: newNodeId, label: newNodeId },
        scratch: { _fluxo: newNodeId },
        position: newPosition,
        classes: [classes.nodeClasses],
        style: classes.styles ? { ...classes.styles, label: newNodeId } : { label: newNodeId }
      },
      {
        group: 'edges',
        data: {
          id: 'edge-' + clickedElement.id() + '-' + newNodeId,
          source: clickedElement.id(),
          target: newNodeId,
          label: '',
        },
        classes: classes.edgeClasses
      }
    ]);

    this.cy.nodes().unselect();
    const nodeAdicionado = this.cy.getElementById(newNodeId);

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

    this.generateTaskNode(classes, clickedElement, newNodeId);
    this.generateDecisionNode(classes, clickedElement, newNodeId);
    this.generateEndNode(classes, clickedElement, newNodeId);
  }


  private calculateNewPosition(existingChildren: cytoscape.CollectionReturnValue, clickedElement: cytoscape.NodeSingular) {
    let offsetX = 120 + (existingChildren.length * 150);
    let offsetY = 80 + (existingChildren.length * 50);

    let newPosition = {
      x: clickedElement.position().x + offsetX,
      y: clickedElement.position().y + offsetY
    };

    const MIN_DISTANCE = 120;

    const isOverlapping = (pos: { x: number; y: number; }) => {
      return this.cy.nodes().toArray().some((node: cytoscape.NodeSingular) => {
        const nodePos = node.position();
        if (!nodePos) return false;
        const p1 = nodePos.x - pos.x;
        const p2 = nodePos.y - pos.y;
        return Math.sqrt(p1 * p1 + p2 * p2) < MIN_DISTANCE;
      });
    };

    while (isOverlapping(newPosition)) {
      offsetX += 140;
      offsetY += 50;
      newPosition = {
        x: clickedElement.position().x + offsetX,
        y: clickedElement.position().y + offsetY
      };
    }
    return newPosition;
  }

  private generateEndNode(classes: any, clickedElement: any, newNodeId: string) {
    if (classes.nodeClasses === 'end-node') {
      const transitionId = `trans_${newNodeId}`;

      const transitionXml = this.xmlTemplateService.generateTransition(newNodeId, transitionId);
      this.xmlTemplateService.triggerInsertNode(clickedElement.data('id'), transitionXml);

      const nodeXml = this.xmlTemplateService.generateEndState(newNodeId, '');
      this.xmlTemplateService.triggerAppendNode(nodeXml);
    }
  }

  private generateTaskNode(classes: any, clickedElement: any, newNodeId: string) {
    console.log('Elemento clicado: ', clickedElement.data('id'));

    if (classes.nodeClasses === 'task-node') {
      const transitionId = `trans_${newNodeId}`;
      const transitionXml = this.xmlTemplateService.generateTransition(newNodeId, transitionId);
      this.xmlTemplateService.triggerInsertNode(clickedElement.data('id'), transitionXml);

      const xmlSnippet = this.xmlTemplateService.generateTaskNode(newNodeId);

      const newNode = this.cy.getElementById(newNodeId);
      newNode.data({
        ...newNode.data(),
        id: newNodeId,
        label: newNodeId,
        xmlSnippet: xmlSnippet,
        xmlRepresentation: this.xmlSnippetRepresentationService.mapXmlSnippetToRepresentation(xmlSnippet)
      });

      this.xmlTemplateService.triggerAppendNode(xmlSnippet);
    }
  }

  private generateDecisionNode(classes: any, clickedElement: cytoscape.NodeSingular, newNodeId: string) {
    if (classes.nodeClasses === 'decision-node') {
      const transitionId = `trans_${newNodeId}`;
      const transitionXml = this.xmlTemplateService.generateTransition(newNodeId, transitionId);
      this.xmlTemplateService.triggerInsertNode(clickedElement.data('id'), transitionXml);

      const nodeXml = this.xmlTemplateService
        .generateDecisionNode(newNodeId, "#{tramitacaoProcessualService.temSituacao('jus:suspenso') ? 'Analisar pendência para arquivamento' : 'Tem bem apreendido?'}");
      this.xmlTemplateService.triggerAppendNode(nodeXml);
    }
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
    this.reloadSubscription.unsubscribe();
    this.clearSubscription.unsubscribe();
  }

  clearGraph() {
    this.cy.elements().not("#0").remove();

    this.grafoService.setGrafo({
      length: 1,
      node: this.cy.getElementById("0"),
      form: new FormGroup({}),
      collection: this.cy.nodes(),
      visible: false
    })
  }

}
