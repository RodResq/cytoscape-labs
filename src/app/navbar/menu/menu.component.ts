import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';

import { XMLImporterService } from '@shared/services/xml-importer.service';

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

  constructor() {}

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        id: '0',
        label: 'Criar Fluxograma',
        command: () => {
            this.router.navigate(['/fluxoApp/fluxo']);
        }
      },
      {
        id: '1',
        label: 'Importar XML',
        command: () => {
          const fileInput = document.getElementById('xmlFileInput') as HTMLInputElement;
          if (fileInput) {
            fileInput.click();
          }
        }
      },
      {
        id: '2',
        label: 'Exportar',
      }
    ]
  }

  importXmlAndCreateGraph(xmlString: string): void {
    try {
      const { nodes, edges } = this.xmlImporterService.importFromXml(xmlString);

      localStorage.setItem('importedGraph', JSON.stringify({ nodes, edges }));
      
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'XML importado com sucesso!'
      });

      this.router.navigate(['/fluxoApp/graph']);
      
    } catch (error) {
      console.error('Erro ao importar XML: ', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao processar o arquivo XML. Verifique o formato.'
      });
    }
  }

  onXmlFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const xmlContent = e.target?.result as string;
        this.importXmlAndCreateGraph(xmlContent);
      };

      reader.onerror = () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao ler arquivo'
        });
      };

      reader.readAsText(file);
    }
  }

}
