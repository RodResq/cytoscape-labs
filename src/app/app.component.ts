import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { StepperComponent } from './cytoscape/stepper/stepper.component';
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, StepperComponent,  RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cytoscape-labs';
}
