/**
 * Dados do formulário de fluxo
 */
export interface FluxoFormData {
  fluxo: string;
  descricao: string;
  dataCriacao: string;
}


/**
 * Configuração de ação do formulário
 */
export interface FormAction {
  title: string;
  subTitle: string | null;
  formNumber: number;
  visible: boolean;
  acao?: string;
}

export interface NodeData {
  id?: string;
  form: string | null;
}