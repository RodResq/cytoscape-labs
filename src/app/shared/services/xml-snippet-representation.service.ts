import { Injectable } from '@angular/core';
import { XmlNodeRepresentation } from 'src/app/graph/node-xml-mapping';

@Injectable({
  providedIn: 'root'
})
export class XmlSnippetRepresentationService {

  public mapXmlSnippetToRepresentation(xmlSnippet: string): XmlNodeRepresentation {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlSnippet, 'application/xml');


    const taskElement: any = xmlDoc.getElementsByTagName('task')[0];
    const startStateElement: any = xmlDoc.getElementsByTagName('start-state')[0];

    const name = taskElement?.getAttribute('name') || startStateElement?.getAttribute('name') || 'start';
    const swimlane = taskElement?.getAttribute('swimlane') || '';
    const priority = Number(taskElement?.getAttribute('priority')) || 3;

    return {
      name,
      swimlane,
      priority
    };
  }
}
