import { group } from '@angular/animations';
import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import cytoscape from 'cytoscape';
import { interval } from 'rxjs';
import { CadastroFormComponent } from "../cadastro-form/cadastro-form.component";
import { CadastroService } from '../service/cadastro.service';


@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css'],
  imports: [CadastroFormComponent],
})
export class CytoscapeComponent implements OnInit {
  @ViewChild('cyContainer', { static: true }) cyContainer!: ElementRef;

  private cadastroService = inject(CadastroService);

  public cy: any;

  constructor() {}

  ngOnInit(): void {

    var cy = cytoscape({
      container: this.cyContainer.nativeElement, // container to render in
      elements: {
        // list of graph elements to start with
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
      // initial viewport state:
      zoom: 1,
      pan: { x: 0, y: 0 },

      // interaction options:
      minZoom: 1e-50,
      maxZoom: 1e50,
      zoomingEnabled: true,
      userZoomingEnabled: true,
      panningEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: true,
      selectionType: 'single',
      touchTapThreshold: 8,
      desktopTapThreshold: 4,
      autolock: false,
      autoungrabify: false,
      autounselectify: false,

      // rendering options:
      headless: false,
      styleEnabled: true,
      hideEdgesOnViewport: false,
      textureOnViewport: false,
      motionBlur: false,
      motionBlurOpacity: 0.2,
      wheelSensitivity: 1,
      pixelRatio: 'auto'

    });


    cy.on('tap', 'node', function(evt) {
      let node = evt.target;
      let nodeId = node.id();
      let numero_randomico =  (Math.floor(Math.random() * 100)).toString();
      let valor_concatenado = nodeId.concat(numero_randomico);

      cy.add({
          group: 'nodes',
          data: { id: valor_concatenado},
          position: { x: (Math.floor(Math.random() * 300)), y: (Math.floor(Math.random() * 200)) },
          style: { 'background-color': node.style()['background-color'] }
        });

        cy.add({
            group: 'edges',
            data: { source: nodeId, target: valor_concatenado},
          });

      });
  }

}
