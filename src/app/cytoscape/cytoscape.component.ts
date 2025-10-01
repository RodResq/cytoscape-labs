import { Component, OnInit } from '@angular/core';
import { FluxoFormComponent } from "../fluxo-form/fluxo-form.component";
import { GraphComponent } from '../graph/graph.component';


@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css'],
  standalone: true,
  imports: [FluxoFormComponent, GraphComponent],
})
export class CytoscapeComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }

}
