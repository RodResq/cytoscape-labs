import { AfterViewInit, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';


import { XMLImporterService } from '@shared/services/xml-importer.service';
import { cytoscapeStyles } from '../../graph/cytoscape-styles';

import cytoscape from 'cytoscape';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  standalone: true,
  imports: [Menubar, ToastModule],
  providers: [MessageService]
})
export class MenuComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private xmlImporterService = inject(XMLImporterService);
  private cytoscapeContainer = viewChild.required<ElementRef<HTMLDivElement>>('cyContainer');

  private cy!: cytoscape.Core;

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
        label: 'Importar',
        command: () => {
            this.router.navigate(['fluxoApp/node'])
        }
      },
      {
        id: '2',
        label: 'Exportar',
      }
    ]
  }

  ngAfterViewInit(): void {
    this.initCytoscape()
  }

  private initCytoscape() {
    this.cy = cytoscape({
          container: this.cytoscapeContainer().nativeElement,
          elements: {
            nodes: [
              {
                group: 'nodes',
                data: { id: '0' },
                scratch: {
                  _fluxo: 'initial_fluxo' // contexto de excucao de app fields
                },
                position: { x: 900, y: 100 },
                selected: false,
                selectable: true,
                locked: true,
                grabbable: true,
                classes: ['fluxo', 'start'],
                style: {
                  'text-valign': 'top',
                  'shape': 'ellipse',
                  // 'background-color': '#f8fafc',
                  'border-width': 5,
                  'border-color': 'silver',
                  'border-style': 'solid',
                  label: 'Initial Node'
                }
              },
            ],
            edges: []
          },
          style: cytoscapeStyles,
          layout: {
            name: 'grid',
            rows: 1
          },
          zoom: 1,
          pan: { x: 0, y: 0 },
          minZoom: 1e-50,
          maxZoom: 1e50,
          zoomingEnabled: false,
          userZoomingEnabled: true,
        });
  }

  importXmlAndCreateGraph(xmlString: string): void {
    try {
      const { nodes, edges } = this.xmlImporterService.importFromXml(xmlString);

      this.cy.elements().remove();

      this.cy.add([...nodes, ...edges]);

      this.cy.layout({
        name: 'dagre',
      }).run();

      console.log('Grafo importado com sucesso');
      
    } catch (error) {
      console.error('Erro ao importar XML: ', error);
      alert('Erro ao processar o arquivo XML. Verifique o formato.');
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

      reader.readAsText(file);
    }
  }

}

