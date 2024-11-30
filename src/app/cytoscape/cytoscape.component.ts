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
    cytoscape({
      container: this.cyContainer.nativeElement, // container to render in
      elements: [
        // list of graph elements to start with
        { data: { id: 'a' } },
        { data: { id: 'b' } },
        { data: { id: 'ab', source: 'a', target: 'b' } }
      ],
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
            'line-color': '#FF4136',
            'target-arrow-color': '#FF4136',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1
      }
    });
  }
}
