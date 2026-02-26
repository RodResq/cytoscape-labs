import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface NodeXmlSelection {
  nodeLabel: string;
  nodeId: string;
  xmlSnippet?: string;
  nodeType?: string;
}


@Injectable({
  providedIn: 'root'
})
export class NodeXmlSelectionService {
  
  private nodeSelectionSubject = new Subject<NodeXmlSelection>();
  nodeSelected$ = this.nodeSelectionSubject.asObservable();

  selectNodeInXml(nodeId: string, nodeLabel: string, xmlSnippet?: string, nodeType?: string): void {
    this.nodeSelectionSubject.next({ nodeId, nodeLabel, xmlSnippet, nodeType });
  }
}
