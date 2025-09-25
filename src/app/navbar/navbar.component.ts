import { Component } from '@angular/core';
import { FluxoService } from '../fluxo-form/fluxo.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MenuComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private fluxoService: FluxoService) {}

  openFluxoForm() {
    this.fluxoService.openDrawer();
  }

}
