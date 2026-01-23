import { FormGroup } from "@angular/forms";
import * as cytoscape from 'cytoscape';

/**
 * Representa os dados do grafo com informações sobre nós e formulários
 */
export interface GrafoFormData {
  length: number,
  node: cytoscape.NodeSingular,
  form: FormGroup,
  collection: cytoscape.NodeCollection,
  visible: boolean
}

export interface GraphNodeData {
  id: string;
  idParentNode?: string;
  type?: string;
  label?: string;
}

export interface Position {
  x: number;
  y: number;
}

/**
 * Estrutura de um nó no grafo
 */
export interface GraphNode {
  group: string;
  data: GraphNodeData;
  position: Position;
  classes: string;
  scratch?: Record<string, unknown>;
  selected?: boolean;
  selectable?: boolean;
  locked?: boolean;
  grabbable?: boolean;
  style?: cytoscape.Css.Node;
}

export interface TaskNode {
  id: string;
  form: TaskFormData;
}

export interface TaskFormData {
  nome: string;
  ativo: string;
}

/**
 * Tipos de nós disponíveis no grafo
 */
export enum NodeType {
  TASK = 'task-node',
  DECISION = 'decision-node',
  SYSTEM = 'system-node',
  END = 'end-node',
  EVENT = 'event-node',
  SEPARATION = 'separation-node',
  JOIN = 'join-node',
  SUBPROCESS = 'subprocess-node',
  START = 'start'
}

/**
 * Tipos de arestas/conexões
 */
export enum EdgeType {
  SOLID = '',
  DOTTED = 'dotted',
  DASHED = 'dashed'
}

export interface MenuItemClasses {
  nodeClasses: string;
  edgeClasses: string;
}
