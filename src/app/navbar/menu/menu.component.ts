import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

import { FluxoService } from '../../fluxo-form/fluxo.service';
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
  private fluxoService = inject(FluxoService);
  private messageService = inject(MessageService)
  items: MenuItem[] | undefined;
  
  ngOnInit(): void {
    this.items = [
      {
        label: 'Criar Fluxo',
        command: ($event) => {
          const nomeAcao: string | undefined = $event.item?.label?.toString();
          this.fluxoService.setAcao(nomeAcao)
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

