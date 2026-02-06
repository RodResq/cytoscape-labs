import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  standalone: true,
  imports: [Menubar, ToastModule],
  providers: [MessageService]
})
export class MenuComponent implements OnInit {
  private router = inject(Router);

  constructor() {}

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        id: '0',
        label: 'Criar Fluxo',
        command: () => this.router.navigate(['/fluxoApp/fluxo'])
      },
      {
        id: '1',
        label: 'Importar XML',
        command: () => this.router.navigate(['/fluxoApp/importar-xml'])
      },
      {
        id: '2',
        label: 'Exportar',
      }
    ]
  }

}
