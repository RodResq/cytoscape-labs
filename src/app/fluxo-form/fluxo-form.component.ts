import { StepperData } from './../task-form/stepper-cache.service';
import { StepperService } from './../cytoscape/stepper/stepper.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { FluxoService } from './fluxo.service';
import { StepperCacheService } from '../task-form/stepper-cache.service';
import { StepperModule } from 'primeng/stepper';
import { Subscription } from 'rxjs';
import { TaskFormComponent } from '../task-form/task-form.component';
import { NodeFormComponent } from '../node-form/node-form.component';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-fluxo-form',
  imports: [ButtonModule, DrawerModule, CommonModule, TaskFormComponent, NodeFormComponent, EventFormComponent],
  standalone: true,
  templateUrl: './fluxo-form.component.html',
  styleUrl: './fluxo-form.component.css'
})
export class FluxoFormComponent implements OnInit {

  @ViewChild(TaskFormComponent) taskFormComponent!: TaskFormComponent;
  private drawerSubscription: Subscription = new Subscription();

  showFluxoForm: boolean = true;
  currentStep: number = 1;
  visible: boolean = false;
  nomeAcao: string | undefined = "";
  showNodeForm: boolean = false;
  showEventForm: boolean = false;

  labelCancelarOrAnterior: string = 'Cancelar';

  constructor(
    private stepperCacheService: StepperCacheService,
    private fluxoService: FluxoService,
    private stepperService: StepperService
  ) {}

  ngOnInit(): void {
    this.fluxoService.acao$.subscribe(acao => {
      this.visible = acao.visible;
      this.nomeAcao = acao.acao;
    });

    this.stepperService.stepperData$.subscribe(step => {
      this.currentStep == step
    });

  }

  saveStep2Data(data: any) {
    this.stepperCacheService.saveStepData('step2', data);
  }

  validateStep2() {
    return true;
  }

  goToNextStep(data: any): void {
    this.salvarDadosFormAnterior(data);
    this.showFluxoForm = false;
    this.labelCancelarOrAnterior = 'Anterior'

    if (this.currentStep === 1) {

      if (this.taskFormComponent && this.taskFormComponent.saveStepData()) {
        this.stepperService.setNextStepper(this.currentStep++);
        this.nomeAcao = 'Configurar Nos';
      } else {
        alert('Por favor, preencha todos os campos obrigatórios antes de continuar.');
      }
      this.showNodeForm = true;

    } else if (this.currentStep === 2) {

      if (this.validateStep2()) {
        this.nomeAcao = 'Configurar Eventos';
        this.showNodeForm = false;
        this.showEventForm = true;

        this.stepperService.setNextStepper(this.currentStep++);
      }
    }
    this.stepperCacheService.setCurrentStep(this.currentStep);
  }

  private salvarDadosFormAnterior(data: any) {
    let previosStepeStr = 'step' + this.currentStep;
    this.stepperCacheService.saveStepData(<keyof StepperData>previosStepeStr, data);
  }

  goToPreviousStep(activateCallBack: (step: number) => void): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      activateCallBack(this.currentStep);
    }
  }

  cancelStepper(): void {
    this.stepperCacheService.clearCache();
    this.stepperService.setPreviosStepper();
  }

  canProceedToNextStep(): boolean {
    switch(this.currentStep) {
      case 1:
        return this.stepperCacheService.isStepValid('step1');
      case 2:
        // return this.stepperCacheService.isStepValid('step2'); TODO RETORNAR LOGICA DEPOIS
        return true
      case 3:
        // return this.stepperCacheService.isStepValid('step3'); TODO RETORNAR LOGICA DEPOIS
        return true
      default:
        return false;
    }
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
