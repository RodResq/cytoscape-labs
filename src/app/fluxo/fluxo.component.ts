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

  private currentGrafoFormData: GrafoFormData | null = null;

  constructor() {
    effect(() => this.currentGrafoFormData = this.grafoService.getGrafo());
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

    const stepperLabel = <keyof StepperData>'step'.concat(currentStepIndex.toString());
    const dadosFormulario = this.formsDataService.getFormByStep(stepperLabel);

    if (dadosFormulario === undefined || dadosFormulario.pristine) {
      return;
    }

    localStorage.setItem(stepperLabel, JSON.stringify(dadosFormulario.value));
    this.salvarDadosNoNode(dadosFormulario);
  }

  private salvarDadosNoNode(dadosForm: FormGroup) {
    const nodeSelected = this.currentGrafoFormData?.node.select();
    nodeSelected?.data('form', dadosForm);
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
