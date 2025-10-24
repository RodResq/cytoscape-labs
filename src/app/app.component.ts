import { Component } from '@angular/core';
import { CytoscapeComponent } from './cytoscape/cytoscape.component';
import { NavbarComponent } from "./navbar/navbar.component";
import { StepperComponent } from './cytoscape/stepper/stepper.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CytoscapeComponent, NavbarComponent, StepperComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cytoscape-labs';
}
