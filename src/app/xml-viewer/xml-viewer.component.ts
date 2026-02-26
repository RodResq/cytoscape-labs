import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphImporterService } from '@shared/services/graph-importer.service';
import { GraphReloadService } from '@shared/services/graph-reload.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadHandlerEvent, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
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
    ButtonModule,
    TextareaModule,
    CardModule,
    ToastModule,
    FileUploadModule,
    ButtonModule,
    TagModule
],
  templateUrl: './xml-viewer.component.html',
  styleUrl: './xml-viewer.component.css',
  standalone: true,
  providers: [MessageService]
})
export class XmlViewerComponent {
  private messageService = inject(MessageService);
  private graphReloadService = inject(GraphReloadService);
  private graphImporterService = inject(GraphImporterService);
  uploadedFiles: any[] = [];

  xmlCode: string = '';
  selectedFileName: string = '';
  lineNumbers: number[] = [];

  constructor() {
  }

  async importXmlAndCreateGraph(xmlString: string): Promise<void> {
    const result = await this.graphImporterService.importXmlAndCreateGraph(xmlString);

    this.messageService.add({
      severity: result.success ? 'success': 'error',
      summary: result.success ? 'Sucesso': 'Erro',
      detail: result.message
    });
  }

  onFileSelected(event: FileUploadEvent) {
    const files = event.files;
    console.log('File:', files[0]);

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
          this.graphReloadService.triggerXmlLoad(this.xmlCode);
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

  onUpload(event: FileUploadHandlerEvent) {
    const files = event.files;
    console.log('File:', files[0]);

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

      this.selectedFileName = '';
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const xmlContent = e.target.result as string;
          this.xmlCode = xmlContent;
          this.graphReloadService.triggerXmlLoad(this.xmlCode);
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
