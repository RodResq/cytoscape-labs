import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import cytoscape from 'cytoscape';
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';

cytoscape.use(contextMenus);

@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css'],
})
export class CytoscapeComponent implements OnInit {
  @ViewChild('cyContainer', { static: true }) 
  cytoscapeContainer!: ElementRef;
  
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
          onClickFunction: () => { 
            console.log('remove element');
          },
          disabled: false, 
          show: true, 
          hasTrailingDivider: true, 
          coreAsWell: false, 
          submenu: [] 
        },
        {
          id: 'add-note-decisão',
          content: 'Adicionar nó de decisão',
          tooltipText: 'Adcione um nó de decisão no fluxo',
          selector: 'node, edge',
          onClickFunction:  () => {
            console.log('click Adicionar nó de decisão');
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
          onClickFunction: () => {
            console.log('Adicionar nó de tarefa');
          }
        }
      ],
      menuItemClasses: [
      ],
      contextMenuClasses: [
      ],
      submenuIndicator: { src: 'assets/icons/submenu-indicator-default.svg', width: 12, height: 12 }
  };
  
  constructor() {}

  ngOnInit(): void {

    this.cy = cytoscape({
      container: this.cytoscapeContainer.nativeElement,
      elements: {
        nodes: [
          { data: { id: 'a' }, position: {x: 100, y: 100}, style: {'background-color': 'red'} },
          { data: { id: 'b' }, position: {x: 200, y: 200}, style: {'background-color': 'green'} },
          { data: { id: 'c' }, position: {x: 300, y: 300}, style: {'background-color': 'silver'} },
          { data: { id: 'd' } }],
        edges: [
          { data: { id: 'ab', source: 'a', target: 'b' } },
          { data: { id: 'bc', source: 'b', target: 'c' } },
          { data: { id: 'bd', source: 'b', target: 'd' } }]
      },
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#0074D9',
            label: 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1
      },
    });

    this.cy.contextMenus(this.options);
    
  }
}
