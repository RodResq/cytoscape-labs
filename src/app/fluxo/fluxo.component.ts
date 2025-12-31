import { StepperCacheService } from './../cytoscape/stepper/stepper-cache.service';
import { Component, effect, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { StepperData } from '../cytoscape/stepper/stepper-cache.service';
import { StepperService } from '../cytoscape/stepper/stepper.service';
import { FormsDataService } from '../shared/services/forms-data.service';
import { FluxoService } from './fluxo-form/fluxo.service';
import { GrafoFormData, GrafoService } from '../shared/services/grafo.service';
import { FormGroup } from '@angular/forms';


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
  public fluxoService = inject(FluxoService);
  public formsDataService = inject(FormsDataService);
  public stepperService = inject(StepperService);
  public stepperCacheService = inject(StepperCacheService);
  private grafoService = inject(GrafoService);
  private router = inject(Router);

  private grafo: GrafoFormData | null = null;

  constructor() {
    effect(() => this.grafo = this.grafoService.getGrafo());
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

  private salvarDadosFormAtual() {
    const currentStepIndex = this.stepperService.getCurrentStep();

    console.log('current step: ', currentStepIndex);

    const stepperLabel = <keyof StepperData>'step'.concat(currentStepIndex.toString());
    const dadosFormulario = this.formsDataService.getFormByStep(stepperLabel);

    const dadosNodeAtual = this.salvarDadosNoNode(dadosFormulario.value);

    if (currentStepIndex == 1) {
      const nodesTarefaArray: Array<{}> = [];

      const itemArmazenado = localStorage.getItem('step1');
      console.log('Item Armazenado: ', itemArmazenado);

      if (itemArmazenado) {
        nodesTarefaArray.push(itemArmazenado);
      }

      nodesTarefaArray.push(dadosNodeAtual);
      localStorage.setItem(stepperLabel, JSON.stringify(nodesTarefaArray))

      return
    }
    localStorage.setItem(stepperLabel, JSON.stringify(dadosNodeAtual));

  }

  private salvarDadosNoNode(dadosForm: FormGroup) {
    const nodeSelected = this.grafo?.node.select();
    nodeSelected?.data('form', dadosForm);

    return {
      'id': nodeSelected?.id(),
      'form': nodeSelected?.data().form
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
