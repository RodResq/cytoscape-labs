import { Component, OnInit } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { FluxoFormComponent } from "../fluxo-form/fluxo-form.component";
import { GraphComponent } from '../graph/graph.component';



@Component({
  selector: 'app-cytoscape',
  standalone: true,
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css'],
  imports: [SplitterModule, FluxoFormComponent, GraphComponent],
})
export class CytoscapeComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }

}
