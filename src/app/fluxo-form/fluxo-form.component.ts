import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { TaskFormComponent } from '../task-form/task-form.component';
import { StepperCacheService } from '../task-form/stepper-cache.service';

@Component({
  selector: 'app-fluxo-form',
  imports: [ButtonModule, StepperModule, CommonModule, TaskFormComponent],
  standalone: true,
  templateUrl: './fluxo-form.component.html',
  styleUrl: './fluxo-form.component.css'
})
export class FluxoFormComponent {

  @ViewChild(TaskFormComponent) taskFormComponent!: TaskFormComponent;

  showTaskForm: boolean = true;
  currentStep: number = 1;

  constructor(private stepperCacheService: StepperCacheService) {}

  saveStep2Data(data: any) {
    this.stepperCacheService.saveStepData('step2', data);
  }

  validateStep2() {
    return true;
  }

  goToNextStep(activateCallBack: (step: number) => void): void {
    if (this.currentStep === 1) {
      if (this.taskFormComponent && this.taskFormComponent.saveStepData()) {
        this.currentStep = 2;
        activateCallBack(2);
      } else {
        alert('Por favor, preencha todos os campos obrigatórios antes de continuar.');
      }
    } else if (this.currentStep === 2) {
      if (this.validateStep2()) {
        this.currentStep = 3;
        activateCallBack(3)
      }
    }
    this.stepperCacheService.setCurrentStep(this.currentStep);
  }

  goToPreviousStep(activateCallBack: (step: number) => void): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      activateCallBack(this.currentStep);
    }
  }

  cancelStepper(): void {
    this.stepperCacheService.clearCache();
    this.currentStep = 1;
  }

  canProceedToNextStep(): boolean {
    switch(this.currentStep) {
      case 1:
        return this.stepperCacheService.isStepValid('step1');
      case 2:
        return this.stepperCacheService.isStepValid('step2');
      case 3:
        return this.stepperCacheService.isStepValid('step3');
      default:
        return false;
    }
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
