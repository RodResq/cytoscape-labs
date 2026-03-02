import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Serviço responsável por gerar os templates XML base
 * no formato jPDL 3.2 (jBPM) para o Fluxo Manual.
 */
@Injectable({
  providedIn: 'root'
})
export class XmlTemplateService {
  private appendNodeSubject = new Subject<string>();
  appendNode$ = this.appendNodeSubject.asObservable();

  triggerAppendNode(nodeXml: string) {
    this.appendNodeSubject.next(nodeXml);
  }

  /**
   * Gera o template XML base de um processo (process-definition)
   * já com o elemento start-state incluso.
   *
   * @param processName - Nome do processo (atributo `name` do process-definition)
   */
  generateBaseTemplate(processName: string = 'Novo Fluxo'): string {
    return `<?xml version="1.0" encoding="ISO-8859-1"?>
    <process-definition xmlns="urn:jbpm.org:jpdl-3.2" name="${processName}">
    ${this.generateStartState()}
    </process-definition>`;
  }

  /**
   * Gera apenas o elemento start-state formatado.
   *
   * @param transitionTo   - Nome/ID do nó de destino da transição inicial
   * @param transitionName - Label da transição
   * @param swimlane       - Swimlane responsável pela tarefa inicial
   */
  generateStartState(
    transitionTo: string = 'Tarefa inicial',
    transitionName: string = 'Tarefa inicial',
    swimlane: string = ''
  ): string {
    return `<start-state name="Início">
        <task name="inicial" swimlane="${swimlane}" priority="3"/>
        <transition to="${transitionTo}" name="${transitionName}"/>
    </start-state>`;
  }

  generateTaskNode(
    transitionTo: string = 'Tarefa inicial',
    transitionName: string = 'Tarefa inicial',
    swimlane: string = ''
  ): string {
    return `<task-node end-tasks="true" name="${transitionName}">
        <task name="${transitionName}" swimlane="${swimlane}" priority="3"/>
    </task-node>`;
  }
}
