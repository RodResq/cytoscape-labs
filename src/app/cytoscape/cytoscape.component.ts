import { Component, OnInit } from '@angular/core';
import { GraphComponent } from '../graph/graph.component';
import { FluxoComponent } from '../fluxo/fluxo.component';


@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css'],
  standalone: true,
  imports: [FluxoComponent, GraphComponent],
})
export class CytoscapeComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }

}
