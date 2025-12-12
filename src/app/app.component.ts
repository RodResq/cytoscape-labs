import { Component } from '@angular/core';
import { CytoscapeComponent } from './cytoscape/cytoscape.component';
import { NavbarComponent } from "./navbar/navbar.component";
import { StepperComponent } from './cytoscape/stepper/stepper.component';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [CytoscapeComponent, NavbarComponent, StepperComponent,  RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cytoscape-labs';
}
