import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';

import { XMLImporterService } from '@shared/services/xml-importer.service';
import { GraphReloadService } from '@shared/services/graph-reload.service';

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
  private xmlImporterService = inject(XMLImporterService);
  private messageService = inject(MessageService);
  private graphReloadService = inject(GraphReloadService);
  private fileInput = viewChild<ElementRef<HTMLInputElement>>('xmlFileInput');

  constructor() {}

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        id: '0',
        label: 'Criar Fluxograma',
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
