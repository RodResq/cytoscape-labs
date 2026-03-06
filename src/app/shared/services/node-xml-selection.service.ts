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
  
  private currentSelectedNodeId: string | null = null;
  private oldSelectedNodeId: string | null = null;
  
  selectNodeInXml(nodeId: string, nodeLabel: string, xmlSnippet?: string, nodeType?: string, oldNodeId?: string): void {
    this.currentSelectedNodeId = nodeId;
    this.oldSelectedNodeId = oldNodeId || nodeId;
    this.nodeSelectionSubject.next({ nodeId, nodeLabel, xmlSnippet, nodeType });
  }
  
  getCurrentSelectedNodeId(): string | null {
    return this.currentSelectedNodeId;
  }
  
  getOldSelectedNodeId() {
    return this.oldSelectedNodeId;
  }
  
  updateOldSelectedNodeId(newOldId: string) {
    this.oldSelectedNodeId = newOldId;
  }
}
