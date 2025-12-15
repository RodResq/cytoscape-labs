import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { FluxoService } from '../../fluxo/fluxo-form/fluxo.service';

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
  private fluxoService = inject(FluxoService);


  constructor(private messageService: MessageService) {}

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        id: '0',
        label: 'Criar Fluxograma',
        command: () => {
            this.router.navigate(['/fluxoApp/fluxo']);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File created', life: 3000 });
        }
      },
      {
        id: '1',
        label: 'Importar',
        command: () => {
            this.router.navigate(['fluxoApp/node'])
            this.messageService.add({ severity: 'error', summary: 'warnning', detail: 'Test', life: 3000 });
        }
      },
      {
        id: '2',
        label: 'Exportar',
      }
    ]
  }

}

