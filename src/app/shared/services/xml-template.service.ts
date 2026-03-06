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

  private removeNodeSubject = new Subject<{nodeId: string}>();
  removeNode$ = this.removeNodeSubject.asObservable();

  triggerAppendNode(nodeXml: string) {
    this.appendNodeSubject.next(nodeXml);
  }

  triggerInsertNode(targetNode: string, nodeXml: string) {
    this.insertNodeSubject.next({targetNodeId: targetNode, nodeXml});
  }

  triggerRemoveNode(nodeId: string) {
    this.removeNodeSubject.next({nodeId});
  }

  updateXmlWithObject(xmlCode: string, form: any, oldName?: string): string {
    console.log('Form', form);
    console.log('Old Name', oldName);
    if (!form || !form.name) return xmlCode;
    
    const searchName = oldName || form.name;

    const tagRegex = new RegExp(`<([a-zA-Z0-9-]+)[^>]*name="${searchName}"[^>]*>`, 'i');
    let newXml = xmlCode;

    const match = newXml.match(tagRegex);
    if (!match) return xmlCode;

    const fullTag = match[0];
    let updatedTag = fullTag;

    if (form.name && form.name !== searchName) {
       updatedTag = updatedTag.replace(`name="${searchName}"`, `name="${form.name}"`);
    }

    newXml = newXml.replace(fullTag, updatedTag);

    if (form.task) {
        const startIndex = match.index!;
        const tagName = match[1];
        const closingTag = `</${tagName}>`;
        const closingIndex = newXml.indexOf(closingTag, startIndex);
        
        if (closingIndex !== -1) {
            const innerContent = newXml.substring(startIndex + updatedTag.length, closingIndex);
            
            const taskTagRegex = /<task[^>]*\/>/i;
            const taskMatch = innerContent.match(taskTagRegex);

            if (taskMatch) {
              const oldTaskTag = taskMatch[0];
              let newTaskTag = oldTaskTag;

              for (const [key, value] of Object.entries(form.task)) {
                  if (value === undefined || value === null) continue;
                  
                  const attrRegex = new RegExp(`${key}=".*?"`, 'i');
                  if (attrRegex.test(newTaskTag)) {
                      newTaskTag = newTaskTag.replace(attrRegex, `${key}="${value}"`);
                  } else {
                      newTaskTag = newTaskTag.replace('/>', ` ${key}="${value}"/>`);
                  }
              }

              const updatedInnerContent = innerContent.replace(oldTaskTag, newTaskTag);
              newXml = newXml.substring(0, startIndex + updatedTag.length) + updatedInnerContent + newXml.substring(closingIndex);
            }
        }
    }
    
    // Atualizar as tags <transition> que apontam/referenciam esse nó caso o nome tenha mudado
    if (form.name && form.name !== searchName) {
        const transitionRegexGlobal = /<transition[^>]*\/>/gi;
        newXml = newXml.replace(transitionRegexGlobal, (transitionMatch) => {
            let updatedTransition = transitionMatch;
            
            const toAttr = `to="${searchName}"`;
            if (updatedTransition.includes(toAttr)) {
                updatedTransition = updatedTransition.replace(toAttr, `to="${form.name}"`);
            }
            
            const nameAttr = `name="trans_${searchName}"`;
            if (updatedTransition.includes(nameAttr)) {
                updatedTransition = updatedTransition.replace(nameAttr, `name="trans_${form.name}"`);
            }
            return updatedTransition;
        });
    }

    console.log('New Xml', newXml);

    return newXml;
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

  generateDecisionNode(
    name: string = '',
    expression: string = ''
  ): string {
    return `<decision expression="${expression}" name="${name}">
</decision>`;
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
