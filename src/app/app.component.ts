import { Component } from '@angular/core';
import { CytoscapeComponent } from './cytoscape/cytoscape.component';
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [CytoscapeComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cytoscape-labs';
}
