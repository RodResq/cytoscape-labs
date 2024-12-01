import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import cytoscape from 'cytoscape';

@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css'],
})
export class CytoscapeComponent implements OnInit {
  @ViewChild('cyContainer', { static: true }) cyContainer!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    var cy = cytoscape({container: this.cyContainer.nativeElement});
    /**
    cytoscape({
      container: this.cyContainer.nativeElement, // container to render in
      elements: {
        // list of graph elements to start with
        nodes: [
          { data: { id: 'a' }, position: {x: 100, y: 100}, style: {'background-color': 'red'} },
          { data: { id: 'b' }, position: {x: 200, y: 200}, style: {'background-color': 'green'} },
          { data: { id: 'c' }, position: {x: 300, y: 200}, style: {'background-color': 'silver'} },
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
    }).add({group: 'nodes', data: {weight: 75}, position: { x: 200, y: 200}})
     */
    // cy.add({
    //   group: 'nodes',
    //   data: {id: 'teste',  weight: 75},
    //   position: { x: 300, y: 300}
    // });


    var eles = cy.add([
      { group: 'nodes', data: { id: 'a' }, position: { x: 100, y: 100 }, style: {'background-color': 'red'}},
      { group: 'nodes', data: { id: 'b' }, position: { x: 200, y: 200 }, style: {'background-color': 'green'}},
      { group: 'edges', data: { id: 'e0', source: 'a', target: 'b'}}
    ])

    cy.remove('[id = "teste"]')
    cy.add({group: 'nodes', data: { id: 'c', position: { x: 50, y: 50}, style: {'background-color': 'blue'}}})
    cy.add({group: 'edges', data: { id: 'e1', source: 'b', target: 'c'}})

    // var element = cy.getElementById('a');
    // console.log(element);

    // cy.on('tap', 'node', function(evt) {
    //   var node = evt.target;
    //   console.log('tapped ' + node.id());
    // });

    cy.on('tap', function(evt) {
      var evtTarget = evt.target;

      if (evtTarget == cy) {
        console.log('tab on background');
      } else {
        console.log('tap on some element');
      }
    });

  }

}
