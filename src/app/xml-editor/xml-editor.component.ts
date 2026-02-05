import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { XMLImporterService } from '@shared/services/xml-importer.service';
import { GraphReloadService } from '@shared/services/graph-reload.service';

@Component({
  selector: 'app-xml-editor',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    TextareaModule,
    CardModule,
    ToastModule,
    FileUploadModule,
    ButtonModule
  ],
  templateUrl: './xml-editor.component.html',
  styleUrl: './xml-editor.component.css',
  standalone: true,
  providers: [MessageService]
})
export class XmlEditorComponent {
  @ViewChild('codeTextArea') codeTextArea!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  private messageService = inject(MessageService);
  private xmlImporterService = inject(XMLImporterService);
  private graphReloadService = inject(GraphReloadService);

  @Input() xmlCode: string = '';
  highlightedCode: string = '';
  selectedFileName: string = '';
  lineNumbers: number[] = [];
  validationMessage: { isValid: boolean; text: string } | null = null;

  formatXml(xmlString: string) {
    try {
      const formattedXml: string[] = [];
      let indent = 0;
      const tab = '   ';
  
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
  
      return formattedXml.join('>\n').substring(1) + '>';
    } catch (error) {
      console.error('Error ao formatar xml: ', error);
      return xmlString;
    }

  }

  updateHighlight() {
    if (this.xmlCode) {
      const lines = this.xmlCode.split('\n');
      this.lineNumbers = Array.from({ length: lines.length }, (_, i) => i + 1);
    } else {
      this.lineNumbers = []
    }
  }

  formatXmlManual() {
    if (this.xmlCode) {
      this.xmlCode = this.formatXml(this.xmlCode);
      this.updateHighlight();
      this.messageService.add({
        severity: 'info',
        summary: 'Sucesso',
        detail: 'XML formatado com sucesso.'
      })
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Nenhum código XML para formater'
      });
    }
  }

  countTags() {
    if (!this.xmlCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Avisa',
        detail: 'Nenhum código XML disponível'
      });

      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.xmlCode, 'text/xml');

      const allElements = xmlDoc.getElementsByTagName('*');
      const tagCount = allElements.length;

      const uniqueTags = new Set<String>();
      Array.from(allElements).forEach(element => {
        uniqueTags.add(element.tagName);
      });

      const message =`Total de tags: ${tagCount} | Tags únicas: ${uniqueTags.size}`;
      this.messageService.add({
        severity: 'info',
        summary: 'COntagem de tags',
        detail: message,
        life: 500
      });

      console.log('Tags únicas encontradas:', Array.from(uniqueTags));
    } catch (error) { 
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error ao contar tags.'
      })
    }

  }

  copyToClipboard() {
    if (!this.xmlCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Nenhum Código para copiar.'
      });

      return;
    }

    navigator.clipboard.writeText(this.xmlCode).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado',
        detail: 'Código XML copiado para a área de transferência.'
      })
    }).catch(error => {
      console.error('Erro ao copiar:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possivel copiar o código'
      });
    })
  }

  clearCode() {
    this.xmlCode = '';
    this.highlightedCode = '';
    this.selectedFileName = '';
    this.lineNumbers = [];
    this.validationMessage = null;
  }

}
