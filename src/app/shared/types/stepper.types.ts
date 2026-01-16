import { FluxoFormData } from './form.types';

export interface StepperData {
  step0?: FluxoFormData;
  step1?: unknown;
  step2?: unknown;
  step3?: unknown;
}

export enum StepperStep {
  CRIAR_FLUXO = 0,
  CONFIGURAR_NOS = 1,
  CONFIGURAR_EVENTOS = 2,
  CONFIGURAR_TRANSACOES = 3,
  GERAR_XML = 4
}

export enum StepperLabel {
  CRIAR_FLUXO = 'Criar Fluxo',
  CONFIGURAR_NOS = 'Configurar Nós',
  CONFIGURAR_EVENTOS = 'Configurar Eventos',
  CONFIGURAR_TRANSACOES = 'Configurar Transações',
  GERAR_XML = 'Gerar XML'
}