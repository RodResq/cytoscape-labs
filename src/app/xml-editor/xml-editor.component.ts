import { CommonModule } from '@angular/common';
import { AfterContentChecked, AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphImporterService } from '@shared/services/graph-importer.service';
import { NodeXmlSelectionService } from '@shared/services/node-xml-selection.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';

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

  private graphImporterService = inject(GraphImporterService);
  private messageService = inject(MessageService);
  private nodeXmlSelectionService = inject(NodeXmlSelectionService);

  private editorInstance: any = null;
  private monacoLoaded = false;
  private editorInitialized = false;
  private nodeSelectionSub?: Subscription;

  @Input() xmlCode: string = '';

  lineNumbers: number[] = [];
  selectedFileName: string = '';
  validationMessage: { isValid: boolean; text: string } | null = null;
  vsTheme: string = 'vs-light';

  ngAfterViewInit(): void {
    this.loadMonaco();
    this.nodeSelectionSub = this.nodeXmlSelectionService.nodeSelected$.subscribe(({nodeId, nodeLabel, xmlSnippet, nodeType}) => {
      this.highLightNodeInXml(nodeLabel, nodeId, xmlSnippet, nodeType);
    });
  }
  
  ngAfterContentChecked(): void {
    if (this.monacoLoaded && !this.editorInitialized && this.editorContainer?.nativeElement) {
      this.editorInitialized = true;
      this.initEditor();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['xmlCode']) {
      this.updateLineNumbers();

      if (this.monacoLoaded) {
        this.updateEditor();
      }
      
    }
  }
  
  ngOnDestroy(): void {
    this.editorInstance?.dispose();
    this.nodeSelectionSub?.unsubscribe();
  }
  
  private highLightNodeInXml(nodeLabel: string, nodeId: string, xmlSnippet?: string, nodeType?: string): void {
    if (!this.editorInstance) {
      console.warn('[XmlEditor] Editor Monaco ainda não inicializado.');
      return;
    }

    const model = this.editorInstance.getModel();
    if (!model) return;

    const xmlContent: string = model.getValue();
    if (!xmlContent.trim()) return;

    const lines: string[] = xmlContent.split('\n');
    let startLine: number | null = null;
    let endLine: number | null = null;
    let startCol: number = 1;
    
    // usar a primeira linha não-vazia do xmlSnippet
    if (xmlSnippet) {
      const snippetLines: string[] = xmlSnippet
      .split('\n')
      .filter(l => l.trim().length > 0);
      
      const firstSnippetLine = snippetLines[0]?.trimStart();

      const isSelfClosing = this.isSelfClosingTag(firstSnippetLine);

      if (firstSnippetLine) {
        for (let i = 0; i < lines.length; i++) {
          const col = lines[i].indexOf(firstSnippetLine);

          if (col !== -1) {
            startLine = i + 1;
            startCol = col + 1;

            if (isSelfClosing) {
              endLine = startLine;
            } else {
              endLine = startLine + (snippetLines.length -1);
              endLine = Math.min(endLine, lines.length);
            }

            break;
          }
        }
      }

      if (startLine === null) {
        const nameMatch = firstSnippetLine.match(/name="([^"]+)"/);
        if (nameMatch) {
          const xmlTagName = this.nodeTypeToXmlTag(nodeType);

          const searchPattern = xmlTagName 
            ? `<${xmlTagName} name="${nameMatch[1]}`
            : `name="${nameMatch[1]}"`;

          for (let i = 0; i < lines.length; i++) {
            const nameCol = lines[i].indexOf(searchPattern);
            if (nameCol !== -1) {
              const tagStart = lines[i].lastIndexOf('<', nameCol);

              startLine = i + 1;
              startCol  = tagStart !== -1 ? tagStart + 1 : nameCol + 1;
              endLine   = startLine;
              break;
            }
          }
        }
      }
      
    }

    // Estratégia 2: fallback por busca textual
    if (startLine === null) {
      const xmlTagName = this.nodeTypeToXmlTag(nodeType);

      const searchTerms: string[] = xmlTagName 
        ? [
          `<${xmlTagName} name="${nodeLabel}"`,
          `<${xmlTagName} name="${nodeId}"`,
          `name="${nodeLabel}"`, 
          `name="${nodeId}"`,
        ]
        : [
          `name="${nodeLabel}"`,
          `name="${nodeId}"`,
          nodeLabel,
          nodeId
        ]
  
      outer:
      for (const term of searchTerms) {
        if (!term) return;
        for (let i = 0; i < lines.length; i++) {
          const col = lines[i].indexOf(term);
          if (col !== -1) {
            const tagStart = lines[i].lastIndexOf('<', col);
            startLine = i + 1;
            startCol  = tagStart !== -1 ? tagStart + 1 : col + 1;
            endLine   = startLine;
            break outer;
          }
        }
      }
    }
    
    // Resultado
    if (startLine === null || endLine === null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Não encontrado',
        detail: `Nenhum trecho XML encontrado para o nó "${nodeLabel}".`
      });
      return;
    }

    const endCol = lines[endLine - 1].length + 1;

    this.editorInstance.revealLineInCenter(startLine, endLine);
    this.editorInstance.setSelection({
      startLineNumber: startLine,
      startColumn: startCol,
      endLineNumber: endLine,
      endColumn: endCol
    });
    this.editorInstance.focus();
  }
  
  private nodeTypeToXmlTag(nodeType?: string) {
    const map: Record<string, string> = {
      'end-node':        'end-state',
      'start':           'start-state',
      'task-node':       'task-node',
      'subprocess-node': 'process-state',
      'node':            'node',
    };
    return nodeType ? (map[nodeType] ?? null): null;
  }

  private isSelfClosingTag(line: string): boolean {
    return /^<[^>]+\/>$/.test(line.trim());
  }

  private loadMonaco() {
    if ((window as any).monaco) {
      this.monacoLoaded = true;
      this.initEditor();
      return;
    }

    (window as any).require = { paths: {vs: 'assets/vs' } };

    const script = document.createElement('script');
    script.src = 'assets/vs/loader.js';
    script.onload = () => {
      (window as any).require(['vs/editor/editor.main'], () => {
        this.monacoLoaded = true;
        this.initEditor();
      });
    };
    script.onerror = (error) => {
      console.error('Erro ao carregar Monaco:', error);
    }
    document.body.appendChild(script);
  }

  private initEditor() {
    if (!this.editorContainer?.nativeElement) {
      console.warn('Container não disponível ainda');
      return;
    }

    this.editorInstance = (window as any).monaco.editor.create(
      this.editorContainer.nativeElement,
      {
        value: this.xmlCode || '',
        language: 'xml',
        theme: this.vsTheme,
        automaticLayout: true,
        fontSize: 11,
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
  }

  private updateEditor() {
    if (!this.editorInstance) {
      console.warn('Editor não existe');
      return;
    }

    const current = this.editorInstance.getValue();
    if (current != this.xmlCode) {
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

  async updateGraph() {
    if (!this.xmlCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Nenhum código XML para atualizar o grafo'
      });

      return;
    }
    this.xmlCode = this.editorInstance?.getValue() ?? this.xmlCode;
    const result = await this.graphImporterService.importXmlAndCreateGraph(this.xmlCode);

    this.messageService.add({
      severity: result.success ? 'success': 'error',
      summary: result.success ? 'success': 'Erro',
      detail: result.message
    });
  }

  setupTheme() {
    this.vsTheme = this.vsTheme === 'vs-dark'? 'vs-light': 'vs-dark';
    (window as any).monaco?.editor.setTheme(this.vsTheme);
  }

}
