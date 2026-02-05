import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
export class XmlViewerComponent implements AfterViewInit {
  @ViewChild('codeTextArea') codeTextArea!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  private messageService = inject(MessageService);

  xmlCode: string = '';
  highlightedCode: string = '';
  selectedFileName: string = '';
  lineNumbers: number[] = [];
  validationMessage: { isValid: boolean; text: string } | null = null;

  constructor() {

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
          const content = e.target.result as string;
          this.xmlCode = this.formatXml(content);
          this.updateHighlight();
          this.validationMessage = null;

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Arquivo carregado com sucesso.'
          });
        }
      };

      reader.readAsText(file);

    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atencao',
        detail: 'Arquivo xml nao foi adicionado.'
      })
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

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
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
