import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphReloadService } from '@shared/services/graph-reload.service';
import { XMLImporterService } from '@shared/services/xml-importer.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { XmlEditorComponent } from '../xml-editor/xml-editor.component';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
  selector: 'app-xml-viewer',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    TextareaModule,
    CardModule,
    ToastModule,
    FileUploadModule,
    ButtonModule,
    XmlEditorComponent
  ],
  templateUrl: './xml-viewer.component.html',
  styleUrl: './xml-viewer.component.css',
  standalone: true,
  providers: [MessageService]
})
export class XmlViewerComponent {
  private messageService = inject(MessageService);
  private xmlImporterService = inject(XMLImporterService);
  private graphReloadService = inject(GraphReloadService);

  xmlCode: string = '';
  selectedFileName: string = '';
  lineNumbers: number[] = [];

  constructor() {

  }

  async importXmlAndCreateGraph(xmlString: string): Promise<void> {
    try {
      const { nodes, edges } = this.xmlImporterService.importFromXml(xmlString);

      if (nodes.length === 0) {
        throw new Error('Nenhum nó foi encontrado no XML');
      }

      console.log('Salvando no localStorage:', { nodes: nodes.length, edges: edges.length });

      localStorage.setItem('importedGraph', JSON.stringify({ nodes, edges }));

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'XML importado com sucesso!'
      });

      this.graphReloadService.triggerReload();

    } catch (error) {
      console.error('Erro ao importar XML: ', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao processar o arquivo XML. Verifique o formato.'
      });
    }
  }

  onFileSelected(event: FileSelectEvent) {
    const files = event.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (!file.name.toLowerCase().endsWith('.xml')) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atencao',
          detail: 'Por favor, selecione um arquivo XML valido.'
        });
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'O arquivo nao deve ultrapassar 10MB.'
        });
        return;
      }

      this.selectedFileName = file.name;
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const xmlContent = e.target.result as string;
          this.xmlCode = xmlContent;
          this.importXmlAndCreateGraph(xmlContent);
        }
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
