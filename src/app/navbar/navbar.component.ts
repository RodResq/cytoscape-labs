import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MenuComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor() {}

  //TODO Criar Funcao para exportar o graph em JSON
  // cy.json()
  // https://js.cytoscape.org/#cy.json

}
