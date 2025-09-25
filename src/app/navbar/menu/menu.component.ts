import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { FluxoService } from '../../fluxo-form/fluxo.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  standalone: true,
  imports: [Menubar, ToastModule],
  providers: [MessageService]
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(
    private messageService: MessageService,
    private fluxoService: FluxoService) {}
  
  ngOnInit(): void {
    this.items = [
      {
        label: 'Criar Fluxo',
        command: () => {
          this.openFluxoForm();
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


  private openFluxoForm() {
    this.messageService.add({severity: 'success', summary: 'sucess', detail: 'Criação de Fluxo', life: 3000});
    this.fluxoService.openDrawer();
  }
}

