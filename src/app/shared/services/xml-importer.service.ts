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

        const startStates = xmlDoc.getElementsByTagName('start-state');
        Array.from(startStates).forEach((startState, index) => {
            const name = startState.getAttribute('name') || 'Início';
            const nodeId = `start-${index}`;

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
                    type: NodeType.START
                },
                position: { x: 100, y: 100 + (index * 150)},
                classes: 'start'
            })
        });

        const endStates = xmlDoc.getElementsByTagName('end-state');
        Array.from(endStates).forEach((endState, index) => {
            const name = endState.getAttribute('name') || 'Término';
            const nodeId = `end-${index}`;

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
                    type: NodeType.END
                },
                position: { x: 700, y: 100 + (index * 150)},
                classes: 'end-node'
            })
        });

        const taskNodes = xmlDoc.getElementsByTagName('task-node');
        Array.from(taskNodes).forEach((taskNode, index) => {
            const name = taskNode.getAttribute('name') || `Tarefa ${index + 1}`;
            const endTasks = taskNode.getAttribute('end-tasks') === 'true';
            const nodeId = `task-${index}`;

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
                    endTasks: endTasks
                },
                position: { x: 400, y: 100 + (index * 150) },
                classes: 'task-node'
            })
        });

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