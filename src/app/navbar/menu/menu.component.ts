import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { FlowModeService } from '@shared/services/flow-mode.service';


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
  private flowModeService = inject(FlowModeService);

  constructor() {}

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        id: '0',
        label: 'Importar XML',
        command: () => {
          this.flowModeService.setMode('xml-import');
          this.router.navigate(['/fluxoApp/importar-xml']);
        }
      },
      {
        id: '1',
        label: 'Criar Fluxo Manual',
        command: () => {
          this.flowModeService.setMode('manual');
          this.router.navigate(['/fluxoApp/fluxo']);
        }
      }
    ]
  }

}
