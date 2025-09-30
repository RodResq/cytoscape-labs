import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

import { StepperService } from './../cytoscape/stepper/stepper.service';
import { StepperData } from './../task-form/stepper-cache.service';
import { StepperCacheService } from '../task-form/stepper-cache.service';
import { FluxoService } from './fluxo.service';

import { EventFormComponent } from '../event-form/event-form.component';
import { NodeFormComponent } from '../node-form/node-form.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-fluxo-form',
  imports: [ButtonModule, DrawerModule, CommonModule, TaskFormComponent, NodeFormComponent, EventFormComponent],
  standalone: true,
  templateUrl: './fluxo-form.component.html',
  styleUrl: './fluxo-form.component.css'
})
export class FluxoFormComponent implements OnInit {
  private stepperService = inject(StepperService);
  private stepperCacheService = inject(StepperCacheService);
  private fluxoService = inject(FluxoService);

  showFluxoForm: boolean = true;
  currentStep: number = 1;
  visible: boolean = false;
  nomeAcao: string | undefined = "";
  showNodeForm: boolean = false;
  showEventForm: boolean = false;

  labelCancelarOrAnterior: string = 'Cancelar';

  constructor() {}

  ngOnInit(): void {
    this.fluxoService.acao$.subscribe(acao => {
      this.visible = acao.visible;
      this.nomeAcao = acao.acao;
    });
  }

  goTopreviousStep() {
    switch(this.stepperCacheService.getCurrentStep()) {
      case 1:
        this.stepperCacheService.setCurrentStep(0);
        this.stepperService.setPreviousStepper();
        this.showNodeForm = false;
        this.showFluxoForm = true;
        const dataStpe1 = this.stepperCacheService.getStepData('step1')
        console.log('Dados armazenados no storage: ', dataStpe1);

    }
  }

  goToNextStep(data: any): void {
    this.salvarDadosFormAnterior(data);
    console.log('Stepper Atual: ', this.stepperCacheService.getCurrentStep());

    switch(this.stepperCacheService.getCurrentStep()) {
      case 0:
        this.stepperCacheService.setCurrentStep(1);
        this.showFluxoForm = false;
        this.showNodeForm = true;
        break;
      case 1:
        this.stepperCacheService.setCurrentStep(2);
        this.showNodeForm = false;
        this.showEventForm = true;
        break
    }
    this.stepperService.setNextStepper(this.stepperCacheService.getCurrentStep())
  }

  private salvarDadosFormAnterior(data: any) {
    let previosStepeStr = 'step' + this.currentStep;
    console.log('Salvando Step: ', previosStepeStr);

    this.stepperCacheService.saveStepData(<keyof StepperData>previosStepeStr, data);
  }

  canProceedToNextStep(): boolean {
    switch(this.currentStep) {
      case 1:
        return this.stepperCacheService.isStepValid('step1');
      case 2:
        return true
      case 3:
        return true
      default:
        return true;
    }
    return true;
  }

  saveStep2Data(data: any) {
    this.stepperCacheService.saveStepData('step2', data);
  }

  validateStep2() {
    return true;
  }

  finishStepper(): void {
    if (this.validateAllSteps()) {
      const allData = this.stepperCacheService.submitAllData();
      console.log('Dados Finais submetidos: ', allData);
      this.stepperCacheService.clearCache();
      alert('Dados salvos com sucesso');
    } else {
      alert('Complete todos os steps antes de finalizar');
    }
  }
  validateAllSteps(): boolean {
    return this.stepperCacheService.areAllStepsValid();
  }

}
