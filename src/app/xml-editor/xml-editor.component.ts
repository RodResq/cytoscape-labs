import { CommonModule } from '@angular/common';
import { AfterContentChecked, AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

declare const monaco: any;

@Component({
  selector: 'app-xml-editor',
  imports: [
    CommonModule,
    FormsModule,
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
export class XmlEditorComponent implements AfterViewInit, AfterContentChecked,  OnChanges, OnDestroy {

  @ViewChild("editorContainer") editorContainer!: ElementRef<HTMLDivElement>;

  private messageService = inject(MessageService);
  private editorInstance: any = null;
  private monacoLoaded = false;
  private editorInitialized = false;
  
  @Input() xmlCode: string = '';

  lineNumbers: number[] = [];
  selectedFileName: string = '';
  validationMessage: { isValid: boolean; text: string } | null = null;

  
  ngAfterViewInit(): void {
    console.log('[Editor] ngAfterViewInit - xmlCode inicial:', this.xmlCode?.substring(0, 50));
    this.loadMonaco();
  }

  ngAfterContentChecked(): void {
    if (this.monacoLoaded && !this.editorInitialized && this.editorContainer?.nativeElement) {
      this.editorInitialized = true;
      this.initEditor();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['xmlCode']) {
      console.log('[Editor] ngOnChanges - novo xmlCode:', this.xmlCode?.substring(0, 50));
      console.log('[Editor] Monaco carregado?', this.monacoLoaded);

      this.updateLineNumbers();

      if (this.monacoLoaded) {
        this.updateEditor();
      }

    }
  }

  ngOnDestroy(): void {
    this.editorInstance?.dispose();
  }
  
  private loadMonaco() {
    if ((window as any).monaco) {
      console.log('[Editor] Monaco já estava carregado globalmente');
      this.monacoLoaded = true;
      this.initEditor();
      return;
    }

    console.log('[Editor] Carregando Monaco pela primeira vez...');
    (window as any).require = { paths: {vs: 'assets/vs' } };

    const script = document.createElement('script');
    script.src = 'assets/vs/loader.js';
    script.onload = () => {
      (window as any).require(['vs/editor/editor.main'], () => {
        console.log('[Editor] Monaco carregado via require');
        this.monacoLoaded = true;
        this.initEditor();
      });
    };
    script.onerror = (error) => {
      console.error('[Editor] Erro ao carregar Monaco:', error);
    }
    document.body.appendChild(script);
  }

  private initEditor() {
    if (!this.editorContainer?.nativeElement) {
      console.warn('[Editor] Container não disponível ainda');
      return;
    }

    console.log('[Editor] Inicializando editor com xmlCode:', this.xmlCode?.substring(0, 50));

    this.editorInstance = (window as any).monaco.editor.create(
      this.editorContainer.nativeElement,
      {
        value: this.xmlCode || '',
        language: 'xml',
        theme: 'vs-light',
        automaticLayout: true,
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'off',
        formatOnPast: true,
        formatOnType: true,
        lineNumbers: 'on',
        folding: true,
        renderLineHighlight: 'all'
      }
    );

    this.editorInstance.onDidChangeModelContent(() => {
      this.xmlCode = this.editorInstance.getValue();
      this.updateLineNumbers();
    });

    console.log('[Editor] Editor criado com sucesso');
  }

  private updateEditor() {
    if (!this.editorInstance) {
      console.warn('[Editor] updateEditor chamado mas editor não existe');
      return;
    }

    const current = this.editorInstance.getValue();
    if (current != this.xmlCode) {
      console.log('[Editor] Atualizando conteúdo do editor');
      this.editorInstance.setValue(this.xmlCode || '');
    }
  }

  private updateLineNumbers() {
    if (this.xmlCode) {
      this.lineNumbers = Array.from(
        { length: this.xmlCode.split('\n').length },
        (_, i) => i + 1
      )
    } else {
      this.lineNumbers = [];
    }
  }

  formatXml(xmlString: string): string {
    try {
        const formattedXml: string[] = [];
        let indent = 0;
        const tab = '   ';

        const nodes = xmlString.split(/>\s*</);
        nodes.forEach((node, index) => {
            node = node.trim();
            const isTagFechamento = node.match(/^\/\w/);

            if (isTagFechamento) {
                indent--;
            }

            const prefixo = tab.repeat(Math.max(0, indent));
            let formattedNode = '';

            if (index === 0) {
                formattedNode = `${prefixo}${node}>`;
            } else if (index === nodes.length - 1) {
                formattedNode = `${prefixo}<${node}`;
            } else {
                formattedNode = `${prefixo}<${node}>`;
            }

            formattedXml.push(formattedNode);

            const isSelfClosing = node.endsWith('/');
            const isDeclaration = node.startsWith('?');
            const isComment = node.startsWith('!--');

            if (!isTagFechamento && !isSelfClosing && !isDeclaration && !isComment) {
                indent++;
            }
        });

        return formattedXml.join('\n');

    } catch (error) {
        console.error('Erro ao formatar XML: ', error);
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

  formatXmlManualOld() {
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

  formatXmlManual() {
    if (!this.xmlCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Nenhum código para XML formatar.'
      });
      return;
    }

    this.editorInstance
      ?.getAction('editor.action.formatDocument')
      ?.run()
      .then(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Sucesso',
          detail: 'XML formatado com sucesso.'
        })
      })
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
    this.selectedFileName = '';
    this.lineNumbers = [];
    this.validationMessage = null;
    this.editorInstance.setValue('');
  }

}
