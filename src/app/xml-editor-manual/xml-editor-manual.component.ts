import { CommonModule } from '@angular/common';
import { AfterContentChecked, AfterViewInit, Component, ElementRef, inject, ChangeDetectorRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphImporterService } from '@shared/services/graph-importer.service';
import { NodeXmlSelectionService } from '@shared/services/node-xml-selection.service';
import { XmlTemplateService } from '@shared/services/xml-template.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-xml-editor-manual',
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
  templateUrl: './xml-editor-manual.component.html',
  styleUrl: './xml-editor-manual.component.css',
  standalone: true,
  providers: [MessageService]
})
export class XmlEditorManualComponent implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {
  @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLDivElement>;

  private graphImporterService = inject(GraphImporterService);
  private messageService = inject(MessageService);
  private nodeXmlSelectionService = inject(NodeXmlSelectionService);
  private xmlTemplateService = inject(XmlTemplateService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  private editorInstance: any = null;
  private monacoLoaded = false;
  private editorInitialized = false;
  private nodeSelectionSub?: Subscription;
  private appendNodeSub?: Subscription;
  private insertNodeSub?: Subscription;
  private removeNodeSub?: Subscription;
  private isUpdating = false;

  private pendingNodes: string[] = [];

  xmlCode: string = '';

  lineNumbers: number[] = [];
  selectedFileName: string = '';
  validationMessage: { isValid: boolean; text: string } | null = null;
  vsTheme: string = 'vs-light';

  ngOnInit(): void {
    this.xmlCode = this.xmlTemplateService.generateBaseTemplate();
    this.updateLineNumbers();

    this.appendNodeSub = this.xmlTemplateService.appendNode$.subscribe(nodeXml => {
      this.appendNodeToEditor(nodeXml);
    });

    this.insertNodeSub = this.xmlTemplateService.insertNode$.subscribe(({targetNodeId, nodeXml}) => {
      this.insertNodeToEditor(targetNodeId, nodeXml);
    });

    this.removeNodeSub = this.xmlTemplateService.removeNode$.subscribe(({nodeId}) => {
      this.removeNodeFromEditor(nodeId);
    });
  }

  ngAfterViewInit(): void {
    this.loadMonaco();
    this.nodeSelectionSub = this.nodeXmlSelectionService.nodeSelected$.subscribe(({ nodeId, nodeLabel, xmlSnippet, nodeType }) => {
      this.highLightNodeInXml(nodeLabel, nodeId, xmlSnippet, nodeType);
    });
  }

  ngAfterContentChecked(): void {
    if (this.monacoLoaded && !this.editorInitialized && this.editorContainer?.nativeElement) {
      this.editorInitialized = true;
      this.initEditor();
    }
  }

  ngOnDestroy(): void {
    this.editorInstance?.dispose();
    this.nodeSelectionSub?.unsubscribe();
    this.appendNodeSub?.unsubscribe();
    this.insertNodeSub?.unsubscribe();
    this.removeNodeSub?.unsubscribe();
  }

  private removeNodeFromEditor(nodeId: string): void {
    this.ngZone.run(() => {
      if (!this.editorInstance) {
        console.warn('Editor ainda não inicializado. Atualizando xmlCode diretamente.');
        this.xmlCode = this.buildRemoveXml(this.xmlCode, nodeId);
        this.updateLineNumbers();
        return;
      }

      const currentXml = this.editorInstance.getValue();
      const newXml = this.buildRemoveXml(currentXml, nodeId);
      this.setEditorValue(newXml);
    });
  }

  private buildRemoveXml(currentXml: string, nodeId: string): string {
    let newXml = currentXml;

    const transitionRegex = new RegExp(`[ \\t]*<transition[^>]*to="${nodeId}"[^>]*/>(?:\\r?\\n)?`, 'g');
    newXml = newXml.replace(transitionRegex, '');
    
    const transitionRegex2 = new RegExp(`[ \\t]*<transition[^>]*name="trans_${nodeId}"[^>]*/>(?:\\r?\\n)?`, 'g');
    newXml = newXml.replace(transitionRegex2, '');

    const startTagRegex = new RegExp(`[ \\t]*<([a-zA-Z0-9-]+)[^>]*name="${nodeId}"[^>]*>`);
    const match = newXml.match(startTagRegex);
    if (match) {
      const tagName = match[1];
      const startIndex = match.index!;
      const tagContent = match[0];
      
      if (tagContent.trim().endsWith('/>')) {
        const before = newXml.substring(0, startIndex);
        let after = newXml.substring(startIndex + tagContent.length);
        if (after.startsWith('\n')) after = after.substring(1);
        else if (after.startsWith('\r\n')) after = after.substring(2);
        
        newXml = before + after;
      } else {
        const closingTag = `</${tagName}>`;
        const closingIndex = newXml.indexOf(closingTag, startIndex);
        
        if (closingIndex !== -1) {
          const before = newXml.substring(0, startIndex);
          let after = newXml.substring(closingIndex + closingTag.length);
          if (after.startsWith('\n')) after = after.substring(1);
          else if (after.startsWith('\r\n')) after = after.substring(2);
          
          newXml = before + after;
        }
      }
    }

    return newXml;
  }

  private appendNodeToEditor(nodeXml: string): void {
    this.ngZone.run(() => {
      if (!this.editorInstance) {
        console.warn('[XmlEditorManual] Editor ainda não inicializado. Enfileirando nó.');
        this.pendingNodes.push(nodeXml);

        this.xmlCode = this.buildXmlWithNode(this.xmlCode, nodeXml);
        this.updateLineNumbers();
        return;
      }

      const currentXml = this.editorInstance.getValue();
      const newXml = this.buildXmlWithNode(currentXml, nodeXml);
      this.setEditorValue(newXml);
    });
  }

  private buildXmlWithNode(currentXml: string, nodeXml: string): string {
    const closingTag = '</process-definition>';
    const index = currentXml.lastIndexOf(closingTag);

    if (index !== -1) {
      const indentedNode = '    ' + nodeXml.split('\n').join('\n    ');
      return currentXml.substring(0, index) + indentedNode + '\n' + currentXml.substring(index);
    }

    return currentXml + '\n' + nodeXml;
  }

  private insertNodeToEditor(targetNodeId: string, nodeXml: string): void {
    console.log('Target node: ', targetNodeId);
    
    this.ngZone.run(() => {
      if (!this.editorInstance) {
        console.warn('[XmlEditorManual] Editor ainda não inicializado. Enfileirando insert.');
        this.pendingNodes.push(nodeXml);

        this.xmlCode = this.buildInsertXml(this.xmlCode, targetNodeId, nodeXml);
        this.updateLineNumbers();
        return;
      }

      const currentXml = this.editorInstance.getValue();
      const newXml = this.buildInsertXml(currentXml, targetNodeId, nodeXml);
      this.setEditorValue(newXml);
    });
  }

  private buildInsertXml(currentXml: string, targetNodeId: string, nodeXml: string): string {

    let searchName = targetNodeId;
    if (targetNodeId === '0') {
      searchName = 'Início';
    }

    const startTagRegex = new RegExp(`<([a-zA-Z0-9-]+)[^>]*name="${searchName}"`, 'i');
    const startTagMatch = currentXml.match(startTagRegex);
    
    if (startTagMatch) {
      const tagName = startTagMatch[1];
      const startIndex = startTagMatch.index!;
      const closingTag = `</${tagName}>`;
      const closingIndex = currentXml.indexOf(closingTag, startIndex);

      if (closingIndex !== -1) {
        const indentedNode = '    ' + nodeXml.split('\n').join('\n    ');
        return currentXml.substring(0, closingIndex) + indentedNode + '\n    ' + currentXml.substring(closingIndex);
      }
    }
    const closingTagFallback = `</${targetNodeId}>`;
    const fallbackIndex = currentXml.lastIndexOf(closingTagFallback);

    if (fallbackIndex !== -1) {
      const indentedNode = '    ' + nodeXml.split('\n').join('\n    ');
      return currentXml.substring(0, fallbackIndex) + indentedNode + '\n    ' + currentXml.substring(fallbackIndex);
    }

    return currentXml + '\n' + nodeXml;
  }

  private setEditorValue(newXml: string): void {
    this.xmlCode = newXml;

    if (!this.editorInstance) return;

    this.isUpdating = true;
    this.editorInstance.setValue(newXml);
    this.isUpdating = false;
    
    this.updateLineNumbers();
    this.cdr.detectChanges();
  }

  private highLightNodeInXml(nodeLabel: string, nodeId: string, xmlSnippet?: string, nodeType?: string): void {
    if (!this.editorInstance) {
      console.warn('[XmlEditorManual] Editor Monaco ainda não inicializado.');
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
            endLine = isSelfClosing ? startLine : Math.min(startLine + (snippetLines.length - 1), lines.length);
            break;
          }
        }
      }

      if (startLine === null) {
        const nameMatch = firstSnippetLine?.match(/name="([^"]+)"/);
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
              startCol = tagStart !== -1 ? tagStart + 1 : nameCol + 1;
              endLine = startLine;
              break;
            }
          }
        }
      }
    }

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
        ];

      outer:
      for (const term of searchTerms) {
        if (!term) return;
        for (let i = 0; i < lines.length; i++) {
          const col = lines[i].indexOf(term);
          if (col !== -1) {
            const tagStart = lines[i].lastIndexOf('<', col);
            startLine = i + 1;
            startCol = tagStart !== -1 ? tagStart + 1 : col + 1;
            endLine = startLine;
            break outer;
          }
        }
      }
    }

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

  private nodeTypeToXmlTag(nodeType?: string): string | null {
    const map: Record<string, string> = {
      'end-node':        'end-state',
      'start':           'start-state',
      'task-node':       'task-node',
      'subprocess-node': 'process-state',
      'node':            'node',
    };
    return nodeType ? (map[nodeType] ?? null) : null;
  }

  private isSelfClosingTag(line: string): boolean {
    return /^<[^>]+\/>$/.test(line?.trim() ?? '');
  }

  private loadMonaco() {
    if ((window as any).monaco) {
      this.monacoLoaded = true;
      this.initEditor();
      return;
    }

    (window as any).require = { paths: { vs: 'assets/vs' } };

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
    };
    document.body.appendChild(script);
  }

  private initEditor() {
    if (!this.editorContainer?.nativeElement) {
      console.warn('[XmlEditorManual] Container não disponível ainda');
      return;
    }

    this.editorInitialized = true;

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
        formatOnPaste: true,
        formatOnType: true,
        lineNumbers: 'on',
        folding: true,
        renderLineHighlight: 'all'
      }
    );

    this.editorInstance.onDidChangeModelContent(() => {
      this.ngZone.run(() => {
        if (this.isUpdating) return;
        this.xmlCode = this.editorInstance.getValue();
        this.updateLineNumbers();
        this.cdr.detectChanges();
      });
    });
  }

  private updateEditor() {
    if (!this.editorInstance) return;
    const current = this.editorInstance.getValue();
    if (current !== this.xmlCode) {
      this.editorInstance.setValue(this.xmlCode || '');
    }
  }

  private updateLineNumbers() {
    if (this.xmlCode) {
      this.lineNumbers = Array.from(
        { length: this.xmlCode.split('\n').length },
        (_, i) => i + 1
      );
    } else {
      this.lineNumbers = [];
    }
  }

  formatXmlManual() {
    if (!this.xmlCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Nenhum código para formatar.'
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
        });
      });
  }

  copyToClipboard() {
    if (!this.xmlCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Nenhum código para copiar.'
      });
      return;
    }

    navigator.clipboard.writeText(this.xmlCode).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado',
        detail: 'Código XML copiado para a área de transferência.'
      });
    }).catch(error => {
      console.error('Erro ao copiar:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível copiar o código.'
      });
    });
  }

  clearCode() {
    this.xmlCode = '';
    this.selectedFileName = '';
    this.lineNumbers = [];
    this.validationMessage = null;
    this.editorInstance?.setValue('');
  }

  async updateGraph() {
    if (!this.xmlCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Nenhum código XML para atualizar o grafo.'
      });
      return;
    }
    this.xmlCode = this.editorInstance?.getValue() ?? this.xmlCode;
    const result = await this.graphImporterService.importXmlAndCreateGraph(this.xmlCode);

    this.messageService.add({
      severity: result.success ? 'success' : 'error',
      summary: result.success ? 'Sucesso' : 'Erro',
      detail: result.message
    });
  }

  setupTheme() {
    this.vsTheme = this.vsTheme === 'vs-dark' ? 'vs-light' : 'vs-dark';
    (window as any).monaco?.editor.setTheme(this.vsTheme);
  }
}
