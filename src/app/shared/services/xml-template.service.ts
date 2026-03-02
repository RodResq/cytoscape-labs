import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XmlTemplateService {
  private appendNodeSubject = new Subject<string>();
  appendNode$ = this.appendNodeSubject.asObservable();

  private insertNodeSubject = new Subject<{targetNodeId: string, nodeXml: string}>();
  insertNode$ = this.insertNodeSubject.asObservable();

  triggerAppendNode(nodeXml: string) {
    this.appendNodeSubject.next(nodeXml);
  }

  triggerInsertNode(targetNode: string, nodeXml: string) {
    this.insertNodeSubject.next({targetNodeId: targetNode, nodeXml});
  }

  generateBaseTemplate(processName: string = 'Novo Fluxo'): string {
    return `<?xml version="1.0" encoding="ISO-8859-1"?>
<process-definition xmlns="urn:jbpm.org:jpdl-3.2" name="${processName}">
    ${this.generateStartState().split('\n').join('\n    ')}
</process-definition>`;
  }

  generateStartState(
    name: string = 'start',
    swimlane: string = ''
  ): string {
    return `<start-state name="${name}">
    <task name="${name}" swimlane="${swimlane}" priority="3"/>
</start-state>`;
  }

  generateTransition(
    to: string = '', 
    name: string = ''): string {
    return `<transition to="${to}" name="${name}"/>`;
  }

  generateTaskNode(
    name: string = '',
    swimlane: string = ''
  ): string {
    return `<task-node end-tasks="true" name="${name}">
    <task name="${name}" swimlane="${swimlane}" priority="3"/>
</task-node>`;
  }

  generateEndState(
    name: string = '',
    swimlane: string = ''
  ): string {
    return `<end-state name="${name}">
    <task name="${name}" swimlane="${swimlane}" priority="3"/>
</end-state>`;
  }
}
