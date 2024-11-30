import { Component } from '@angular/core';
import { CytoscapeComponent } from './cytoscape/cytoscape.component';

@Component({
  selector: 'app-root',
  imports: [CytoscapeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cytoscape-labs';
}
