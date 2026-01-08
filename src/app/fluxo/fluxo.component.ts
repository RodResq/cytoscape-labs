import { StepperCacheService } from './../cytoscape/stepper/stepper-cache.service';
import { Component, effect, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { StepperData } from '../cytoscape/stepper/stepper-cache.service';
import { StepperService } from '../cytoscape/stepper/stepper.service';
import { FormsDataService } from '../shared/services/forms-data.service';
import { Acao, FormService } from '../shared/services/form.service';
import { GrafoFormData, GrafoService } from '../shared/services/grafo.service';
import { FormGroup } from '@angular/forms';


export interface nodeData {
  id: string | undefined;
  form: string | null;
}

@Component({
  selector: 'app-fluxo',
  imports: [
    RouterModule,
    CardModule,
    ButtonModule,
    RouterOutlet,
    CommonModule
],
  templateUrl: './fluxo.component.html',
  styleUrl: './fluxo.component.css'
})
export class FluxoComponent {
  public formService = inject(FormService);
  public formsDataService = inject(FormsDataService);
  public stepperService = inject(StepperService);
  public stepperCacheService = inject(StepperCacheService);
  private grafoService = inject(GrafoService);
  private router = inject(Router);

  public grafo: GrafoFormData | null = null;
  public form: Acao | null = null;

  constructor() {
    effect(() => this.grafo = this.grafoService.getGrafo());
    effect(() => this.form = this.formService.getForm())
  }


  back() {
    const currentStepper = this.stepperService.getCurrentStep();

    if (currentStepper == 3) {
      this.stepperService.setPreviousStepper();
      this.router.navigate(['/fluxoApp/event'])
    } else if (currentStepper == 2) {
      this.stepperService.setPreviousStepper();
      this.router.navigate(['/fluxoApp/node'])
    } else if (currentStepper == 1) {
      this.stepperService.setPreviousStepper();
      this.router.navigate(['/fluxoApp/fluxo'])
    }

  }

  next() {
    this.salvarDadosFormAtual();
    this.irParaProximoStepper();
  }

  //TODO refator para dexa metodo mais legivel
  private salvarDadosFormAtual() {
    const currentStep = this.stepperService.getCurrentStep();
    const stepperLabel = <keyof StepperData>'step'.concat(currentStep.toString());
    const dadosFormulario = this.formsDataService.getFormByStep(stepperLabel);
    const dadosNodeAtual = this.salvarDadosNoNode(dadosFormulario?.value);

    if (currentStep == 1) {
      let nodesTarefaArray: Array<{}> = [];
      const itemArmazenado = localStorage.getItem('step1');

      if (itemArmazenado) {
        try {
          const dadosParsed: Array<any> = JSON.parse(itemArmazenado);

          if (Array.isArray(dadosParsed)) {
            const itemExistente = dadosParsed.some(dado => dado.id == this.grafo?.node.id());

            if (itemExistente) {
              nodesTarefaArray = dadosParsed.map(dado =>
                dado.id === this.grafo?.node.id() ? dadosNodeAtual: dado
              )
            } else {
              nodesTarefaArray = [...dadosParsed, dadosNodeAtual]
            }
          } else {
            nodesTarefaArray.push(dadosParsed);
            nodesTarefaArray.push(dadosNodeAtual);
          }
        } catch (error) {
          console.error('Erro ao fazer o parse do JSON: ', error);
        }
      } else {
        nodesTarefaArray.push(dadosNodeAtual);
      }

      localStorage.setItem(stepperLabel, JSON.stringify(nodesTarefaArray))
      return;
    }

    localStorage.setItem(stepperLabel, JSON.stringify(dadosNodeAtual));
  }

  private salvarDadosNoNode(dadosForm: FormGroup): nodeData {
    const nodeSelected = this.grafo?.node.select();
    nodeSelected?.data('form', dadosForm);

    return {
      id: nodeSelected?.id(),
      form: nodeSelected?.data().form
    };
  }

  private irParaProximoStepper() {
    const currentStep = this.stepperService.getCurrentStep();

    if (currentStep == 0) {
      this.router.navigate(['/fluxoApp/node']);
    } else if (currentStep == 1) {
      this.router.navigate(['/fluxoApp/event']);
    } else if (currentStep == 2) {
      this.router.navigate(['/fluxoApp/build-xml'])
    }
    this.stepperService.setNextStepper();
  }

}
