import { Component, OnInit } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { FluxoFormComponent } from "../fluxo-form/fluxo-form.component";
import { GraphComponent } from '../graph/graph.component';
import { StepperComponent } from './stepper/stepper.component';



@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css'],
  standalone: true,
  imports: [StepperComponent, FluxoFormComponent, GraphComponent],
})
export class CytoscapeComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }

}
