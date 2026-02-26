import { Injectable } from "@angular/core";
import { NodeType } from "@shared/types/graph.types";
import * as cytoscape from 'cytoscape';

export interface XmlNodeMapping {
    id: string;
    name: string;
    type: NodeType;
    label: string;
    transitions?: XmlTransition[];
    task?: XmlTask;
}

export interface XMLAction {
  expression: string;
}

export interface XmlEvent {
  type: string;
  actions: XMLAction[]
}


export interface XmlTransition {
    to: string;
    name: string;
}

export interface XmlTask {
    name: string;
    swimlane?: string;
    priority?: number;
}

@Injectable({
  providedIn: 'root'
})
export class XMLImporterService {

    importFromXml(xmlString: string) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        const nodes: cytoscape.NodeDefinition[] = [];
        const edges: cytoscape.EdgeDefinition[] = [];
        const nodeMapping: Map<string, XmlNodeMapping> = new Map();

        this.extractStartState(xmlDoc, nodeMapping, nodes);
        this.extractProcessState(xmlDoc, nodeMapping, nodes);
        this.extractEndState(xmlDoc, nodeMapping, nodes);
        this.extractTaskNode(xmlDoc, nodeMapping, nodes);
        this.extractNode(xmlDoc, nodeMapping, nodes);
        this.extractDecisionNode(xmlDoc, nodeMapping, nodes);

        nodeMapping.forEach((sourceNode) => {
          if (sourceNode.transitions) {
            sourceNode.transitions.forEach((transition, index) => {
              const targetNode = nodeMapping.get(transition.to);

              if (targetNode) {
                edges.push({
                    group: 'edges',
                    data: {
                        id: `edge-${sourceNode.id}-${targetNode.id}-${index}`,
                        source: sourceNode.id,
                        target: targetNode.id,
                        label: transition.name || ''
                    }
                });
                console.log(`Edge criada: ${sourceNode.name} → ${targetNode.name}`);
              } else {
                console.warn(`Target node não encontrado: "${transition.to}"`);
                console.warn(`Nós disponíveis no mapeamento:`, Array.from(nodeMapping.keys()));
              }
            });
          }
        });

        console.log('Nodes criados:', nodes);
        console.log('Edges criados:', edges);
        console.log('Node Mapping:', nodeMapping);

        return { nodes, edges }
    }
    
    private extractStartState(xmlDoc: Document, nodeMapping: Map<string, XmlNodeMapping>, nodes: cytoscape.NodeDefinition[]) {
        const startStates = xmlDoc.getElementsByTagName('start-state');
        Array.from(startStates).forEach((startState, index) => {
            const task = startState.firstElementChild;
            if (!task) return;

            const name = task.getAttribute('name') || 'Início';
            const swimlane = task.getAttribute('swimlane');
            const nodeId = `${name}-${index}`;

            nodeMapping.set(name, {
                id: nodeId,
                name: name,
                type: NodeType.START,
                label: name,
                transitions: this.extractTransitions(startState)
            });

            nodes.push({
                group: 'nodes',
                data: {
                    id: nodeId,
                    label: name,
                    type: NodeType.START,
                    swimlane: swimlane,
                    events: this.extratEvents(startState),
                    xmlSnippet: this.elementToXmlString(startState)
                },
                position: { x: 50, y: 50 + (index * 50) },
                classes: 'start'
            });
        });
    }

    private extractProcessState(xmlDoc: Document, nodeMapping: Map<string, XmlNodeMapping>, nodes: cytoscape.NodeDefinition[]) {
        const processStates = xmlDoc.getElementsByTagName('process-state');
        Array.from(processStates).forEach((processState, index) => {
            const processStateName = processState.getAttribute('name') || 'process-state';
            const processStateId = `${processStateName}-${index}`;

            const subProcesss = processState.firstElementChild;
            if (!subProcesss) return;

            const name = subProcesss.getAttribute('name') || 'sub-process';
            const swimlane = subProcesss.getAttribute('swimlane') || null;
            const nodeId = `${name}-${index}`;

            nodeMapping.set(processStateName, {
                id: processStateId,
                name: processStateName,
                type: NodeType.SUBPROCESS,
                label: processStateName,
                transitions: this.extractTransitions(processState)
            });

            nodes.push({
                group: 'nodes',
                data: {
                    id: processStateId,
                    label: processStateName,
                    type: NodeType.SUBPROCESS,
                    swimlane: null,
                    subprocess: {
                        id: nodeId,
                        label: name,
                        type: NodeType.SUBPROCESS,
                        swimlane: swimlane,
                        events: this.extratEvents(processState)
                    },
                    events: this.extratEvents(processState),
                    xmlSnippet: this.elementToXmlString(processState)
                },
                position: { x: 50, y: 50 + (index * 50) },
                classes: 'subprocess-node'
            });

        });
    }

    private extractEndState(xmlDoc: Document, nodeMapping: Map<string, XmlNodeMapping>, nodes: cytoscape.NodeDefinition[]) {
        const endStates = xmlDoc.getElementsByTagName('end-state');
        Array.from(endStates).forEach((endState, index) => {
            const name = endState.getAttribute('name') || 'Término';
            const nodeId = `${name}-${index}`;

            nodeMapping.set(name, {
                id: nodeId,
                name: name,
                type: NodeType.END,
                label: name
            });

            nodes.push({
                group: 'nodes',
                data: {
                    id: nodeId,
                    label: name,
                    type: NodeType.END,
                    xmlSnippet: this.elementToXmlString(endState)
                },
                position: { x: 700, y: 100 + (index * 150) },
                classes: 'end-node'
            });
        });
    }

    private extractTaskNode(xmlDoc: Document, nodeMapping: Map<string, XmlNodeMapping>, nodes: cytoscape.NodeDefinition[]) {
        const taskNodes = xmlDoc.getElementsByTagName('task-node');
        Array.from(taskNodes).forEach((taskNode, index) => {
            const task = taskNode.firstElementChild;
            if (!task) return;

            const name = task.getAttribute('name') || `Node ${index + 1}`;
            const swimlane = task.getAttribute('swimlane');
            const endTasks = taskNode.getAttribute('end-tasks') === 'true';
            const nodeId = `${name} (${index})`;

            nodeMapping.set(name, {
                id: nodeId,
                name: name,
                type: NodeType.TASK,
                label: name,
                transitions: this.extractTransitions(taskNode)
            });

            nodes.push({
                group: 'nodes',
                data: {
                    id: nodeId,
                    label: name,
                    type: NodeType.TASK,
                    endTasks: endTasks,
                    swimlane: swimlane,
                    events: this.extratEvents(taskNode),
                    xmlSnippet: this.elementToXmlString(taskNode)
                },
                position: { x: 400, y: 100 + (index * 150) },
                classes: 'task-node'
            });
        });
    }

    private extractNode(xmlDoc: Document, nodeMapping: Map<string, XmlNodeMapping>, nodes: cytoscape.NodeDefinition[]) {
        const node = xmlDoc.getElementsByTagName('node');
        Array.from(node).forEach((node, index) => {
            const name = node.getAttribute('name') || `Node ${index + 1}`;
            const nodeId = `${name} ${index}`;

            nodeMapping.set(name, {
                id: nodeId,
                name: name,
                type: NodeType.NODE,
                label: nodeId,
                transitions: this.extractTransitions(node)
            });

            nodes.push({
                group: 'nodes',
                data: {
                    id: nodeId,
                    label: name,
                    type: NodeType.NODE,
                    events: this.extratEvents(node),
                    xmlSnippet: this.elementToXmlString(node)
                },
                position: { x: 500, y: 100 + (index * 150) },
                classes: 'node'
            });
        });
    }

    private extractDecisionNode(xmlDoc: Document, nodeMapping: Map<string, XmlNodeMapping>, nodes: cytoscape.NodeDefinition[]) {
        const decision = xmlDoc.getElementsByTagName('decision');
        Array.from(decision).forEach((node, index) => {
            const name = node.getAttribute('name') || `Node ${index + 1}`;
            const nodeId = `${name} ${index}`;

            nodeMapping.set(name, {
                id: nodeId,
                name: name,
                type: NodeType.DECISION,
                label: nodeId,
                transitions: this.extractTransitions(node)
            });

            nodes.push({
                group: 'nodes',
                data: {
                    id: nodeId,
                    label: name,
                    type: NodeType.DECISION,
                    events: this.extratEvents(node),
                    xmlSnippet: this.elementToXmlString(node)
                },
                position: { x: 500, y: 100 + (index * 150) },
                classes: 'decision-node'
            });
        });
    }

    private elementToXmlString(element: Element): string {
        const serializer = new XMLSerializer();
        const rawXml = serializer.serializeToString(element);
        return this.formatXmlString(rawXml);
    }

    private formatXmlString(xml: string): string {
        const cleaned = xml.replace(/ xmlns(:\w+)?="[^"]*"/g, '');

        let indent = 0;
        const tab = '   ';
        const lines: string[] = [];

        cleaned.split(/>\s*</).forEach((part, index, arr) => {
            part = part.trim();

            if (part.startsWith('/')) {
                indent = Math.max(0, indent - 1);
            }

            const prefix = tab.repeat(indent);

            if (index === 0) {
                lines.push(`${prefix}${part}>`);
            } else if (index === arr.length - 1) {
                lines.push(`${prefix}<${part}`);
            } else {
                lines.push(`${prefix}<${part}>`);
            }

            const isSelfClosing = part.endsWith('/');
            const isClosingTag  = part.startsWith('/');
            const isDeclaration = part.startsWith('?');
            const isComment     = part.startsWith('!--');

            if (!isSelfClosing && !isClosingTag && !isDeclaration && !isComment) {
                indent++;
            }
        });

        return lines.join('\n')
    }

    private extratEvents(element: Element): XmlEvent[] {
      const events: XmlEvent[] = [];
      const eventsElement = element.getElementsByTagName('event');

      Array.from(eventsElement).forEach((event) => {
        const eventType = event.getAttribute('type');

        const actions: XMLAction[] = [];
        const actionsElements = event.getElementsByTagName('action');

        Array.from(actionsElements).forEach((action) => {
          const expression = action.getAttribute('expression');
          if (expression) {
            actions.push({
              expression: expression
            })
          }
        });

        events.push({
          type: eventType || '',
          actions: actions
        })

      });

      return events;
    }

    private extractTransitions(element: Element): XmlTransition[] {
        const transitions: XmlTransition[] = []
        const transitionElements = element.getElementsByTagName('transition');

        Array.from(transitionElements).forEach((transtion) => {
            const to = transtion.getAttribute('to');
            const name = transtion.getAttribute('name');

            if (to) {
                transitions.push({
                    to: to,
                    name: name || ''
                });
            }
        });

        return transitions;
    }

    private extractTask(element: Element): XmlTask | undefined {
        const taskElement = element.getElementsByTagName('task')[0]

        if (taskElement) {
            return {
                name: taskElement.getAttribute('name') || '',
                swimlane: taskElement.getAttribute('swimlane') || undefined,
                priority: taskElement.getAttribute('priority')
                    ? parseInt(taskElement.getAttribute('priority')!)
                    : undefined
            };
        }


        return undefined;
    }
}
