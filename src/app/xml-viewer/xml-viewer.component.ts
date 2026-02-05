import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphReloadService } from '@shared/services/graph-reload.service';
import { XMLImporterService } from '@shared/services/xml-importer.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileSelectEvent, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

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
    InputTextModule,
    CardModule,
    ToastModule,
    FileUploadModule,
    ButtonModule
  ],
  templateUrl: './xml-viewer.component.html',
  styleUrl: './xml-viewer.component.css',
  standalone: true,
  providers: [MessageService]
})
export class XmlViewerComponent {
  @ViewChild('codeTextArea') codeTextArea!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  private messageService = inject(MessageService);
  private xmlImporterService = inject(XMLImporterService);
  private graphReloadService = inject(GraphReloadService);

  xmlCode: string = '';
  highlightedCode: string = '';
  selectedFileName: string = '';
  lineNumbers: number[] = [];
  validationMessage: { isValid: boolean; text: string } | null = null;

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

  formatXml(xmlString: string) {
    const formattedXml: string[] = [];
    let indent = 0;
    const tab = ' ';

    xmlString.split(/>\s*</g).forEach((node, index) => {
      if (node.match(/^\/\w/)) {
        indent--;
      }

      const isClossing = node.match(/^\/\w/) !== null;
      const prefix = tab.repeat(Math.max(0, indent));
      const opennig = isClossing ? '</': '<';

      formattedXml.push(`${prefix}${opennig}${node}`);

      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('?')) {
        indent++;
      }
    });

    return formattedXml.join('\n').substring(1);
  }

  formatXmlManual() {
    if (this.xmlCode) {
      this.xmlCode = this.formatXml(this.xmlCode);
      // this.updateHighlight();
      this.messageService.add({
        severity: 'info',
        summary: 'Sucesso',
        detail: 'XML formatado com sucesso.'
      })
    }
  }

  updateHighlight() {

  }

  validateXml() {

  }

  countTags() {

  }

  copyToClipboard() {

  }

  downloadXml() {

  }

  clearCode() {
    this.xmlCode = '';
    this.highlightedCode = '';
    this.selectedFileName = '';
    this.lineNumbers = [];
    this.validationMessage = null;
  }

}
