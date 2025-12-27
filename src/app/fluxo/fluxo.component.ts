import { Component, inject, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { StepperData } from '../cytoscape/stepper/stepper-cache.service';
import { StepperService } from '../cytoscape/stepper/stepper.service';
import { FormsDataService } from '../shared/services/forms-data.service';
import { FluxoService } from './fluxo-form/fluxo.service';


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
  public stepperService = inject(StepperService);
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {}

  back() {
    console.log('Onclick back');

  }

  next() {
    this.salvarDadosFormAtual();
    this.irParaProximoStepper();
  }



  private salvarDadosFormAtual() {
    const currentStepIndex = this.stepperService.getCurrentStep();
    console.log('Current Stepper: ', currentStepIndex);

    const stepperLabel = <keyof StepperData>'step'.concat(currentStepIndex.toString());
    const dadosFormulario = JSON.stringify(this.formsDataService.getFormByStep(stepperLabel)?.value);
    localStorage.setItem(stepperLabel, dadosFormulario);
  }


  private irParaProximoStepper() {
    this.stepperService.setNextStepper();
    this.router.navigate(['/fluxoApp/node']);
  }
}
