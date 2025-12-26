import { Component, effect, inject, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from "@angular/router";
import { Acao, FluxoService } from './fluxo-form/fluxo.service';
import { FormsDataService } from '../shared/services/forms-data.service';
import { StepperService } from '../cytoscape/stepper/stepper.service';
import { StepperCacheService, StepperData } from '../cytoscape/stepper/stepper-cache.service';
import { StepperLabelEnum } from '../cytoscape/stepper/steppper.enum';


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
export class FluxoComponent implements OnInit{
  public fluxoService = inject(FluxoService);
  public formsDataService = inject(FormsDataService);
  public stepperCacheService = inject(StepperCacheService);

  public fluxoForm!: Acao;

  constructor() { }

  ngOnInit(): void {
    this.fluxoForm = this.fluxoService.form();
  }

  back() {
    console.log('Onclick back');
    
  }

  next() {
    const currentStepIndex = this.stepperCacheService.getCurrentStep();
    this.salvarDadosFormAtual(currentStepIndex);
    this.irParaProximoStepper(currentStepIndex);
  }
  


  private salvarDadosFormAtual(currentStepIndex: number) {
    const stepperLabel = <keyof StepperData>'step'.concat(currentStepIndex.toString());

    console.log('Currente Stepper Label: ', stepperLabel);

    const dadosFormulario = JSON.stringify(this.formsDataService.getFormByStep(stepperLabel).value);
    localStorage.setItem(stepperLabel, dadosFormulario);
  }


  private irParaProximoStepper(currentStepIndex: number) {
    const proximoStepper = ++currentStepIndex;
    console.log('Proximo Stepper: ', proximoStepper);
    
  }
}
