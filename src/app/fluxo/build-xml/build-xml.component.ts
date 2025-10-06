import { Component } from '@angular/core';
import { BlockUI } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-build-xml',
  imports: [BlockUI, ButtonModule, PanelModule],
  templateUrl: './build-xml.component.html',
  styleUrl: './build-xml.component.css'
})
export class BuildXmlComponent {
  blockedPanel: boolean = true;
}
