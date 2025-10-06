import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { FluxoService } from '../../fluxo/fluxo-form/fluxo.service';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  standalone: true,
  imports: [Menubar, ToastModule],
})
export class MenuComponent implements OnInit {
  private fluxoService = inject(FluxoService);
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Criar Fluxo',
        command: () => {
          this.fluxoService.openForm();
        }
      },
      {
        label: 'Importar'
      },
      {
        label: 'Exportar'
      }
    ]
  }

}

