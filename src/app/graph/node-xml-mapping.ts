import { NodeType } from "@shared/types/graph.types";

/**
 * Parâmetros dinâmicos para geração de elementos XML.
 * Cada campo representa um atributo ou valor utilizado
 * nos templates XML dos nós do fluxo (jpdl-3.2).
 */
export interface XmlNodeRepresentation {
  /** Nome/label do nó exibido no fluxo */
  name: string;
  /** Nome da transição de saída */
  transitionName?: string;
  /** Nó de destino da transição */
  transitionTo?: string;
  /** Swimlane (responsável) pela tarefa */
  swimlane?: string;
  /** Prioridade da tarefa (1–5) */
  priority?: number;
  /** Indica se a tarefa encerra o fluxo */
  endTasks?: boolean;
  /** Expressão da ação de evento (usado em SYSTEM) */
  actionExpression?: string;
  /** Tipo do evento (ex: node-enter, node-leave) */
  eventType?: string;
}

/**
 * Assinatura de uma função geradora de XML.
 * Recebe parâmetros dinâmicos e retorna a string XML do elemento.
 */
export type XmlGenerator = (params: XmlNodeRepresentation) => string;

/**
 * Mapeamento entre cada NODE_TYPE e sua função geradora
 * do elemento XML equivalente no formato jPDL 3.2.
 *
 * Uso:
 *   const xml = NODE_TYPE_XML_MAP[NODE_TYPES.TASK]({ name: 'Analisar', swimlane: 'analista' });
 */
export const NODE_TYPE_XML_MAP: Record<string, XmlGenerator> = {

  [NodeType.START]: ({ 
    name,
    transitionName,
    transitionTo,
    swimlane,
    priority,
    endTasks,
    actionExpression,
    eventType
   }: XmlNodeRepresentation): string => `
  <start-state name=${name}>
  <task name=${name} swimlane=${swimlane} priority=${priority}/>
</start-state> `,

  /**
   * TASK → <task-node>
   * Representa uma tarefa humana no fluxo.
   *
   * <task-node name="${name}" end-tasks="${endTasks}">
   *   <task name="${name}" swimlane="${swimlane}" priority="${priority}"/>
   *   <transition to="${transitionTo}" name="${transitionName}"/>
   * </task-node>
   */
  [NodeType.TASK]: ({
    name,
    swimlane = '',
    priority = 3,
    endTasks = false,
    transitionTo = '',
    transitionName = ''
  }: XmlNodeRepresentation): string => `<task-node name="${name}" end-tasks="${endTasks}">
  <task name="${name}" swimlane="${swimlane}" priority="${priority}"/>
  <transition to="${transitionTo}" name="${transitionName}"/>
</task-node>`,

  /**
   * DECISION → <decision>
   * Representa um nó de desvio condicional no fluxo.
   *
   * <decision name="${name}">
   *   <transition to="${transitionTo}" name="${transitionName}"/>
   * </decision>
   */
  [NodeType.DECISION]: ({
    name,
    transitionTo = '',
    transitionName = ''
  }: XmlNodeRepresentation): string => `<decision name="${name}">
  <transition to="${transitionTo}" name="${transitionName}"/>
</decision>`,

  /**
   * SYSTEM → <node> com evento de ação automática.
   * Representa uma ação executada pelo sistema.
   *
   * <node name="${name}">
   *   <event type="${eventType}">
   *     <action expression="${actionExpression}"/>
   *   </event>
   *   <transition to="${transitionTo}" name="${transitionName}"/>
   * </node>
   */
  [NodeType.SYSTEM]: ({
    name,
    eventType = 'node-enter',
    actionExpression = '',
    transitionTo = '',
    transitionName = ''
  }: XmlNodeRepresentation): string => `<node name="${name}">
  <event type="${eventType}">
    <action expression="${actionExpression}"/>
  </event>
  <transition to="${transitionTo}" name="${transitionName}"/>
</node>`,

  /**
   * END → <end-state>
   * Representa o estado final do fluxo.
   *
   * <end-state name="${name}"/>
   */
  [NodeType.END]: ({
    name
  }: XmlNodeRepresentation): string => `<end-state name="${name}"/>`,
};
