import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperCacheService, StepperData } from '../../cytoscape/stepper/stepper-cache.service';
import { ButtonsService } from './buttons.service';
import { ButtonsCancelPreviousComponent } from "./buttons-cancel-previous/buttons-cancel-previous.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buttons-form',
  imports: [ButtonModule, ButtonsCancelPreviousComponent, CommonModule],
  templateUrl: './buttons-form.component.html',
  styleUrl: './buttons-form.component.css'
})
export class ButtonsFormComponent {

  private stepperCacheService = inject(StepperCacheService);
  private buttonsService = inject(ButtonsService);

  currentStep: number = 1;

  labelCancelarOrAnterior: string = 'Cancelar';

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


  goToNextStep(data: any): void {
    this.salvarDadosFormAnterior(data);
    console.log('Stepper Atual: ', this.stepperCacheService.getCurrentStep());

    this.labelCancelarOrAnterior = 'Anterior';

    switch(this.stepperCacheService.getCurrentStep()) {
      case 0:
        this.stepperCacheService.setCurrentStep(1);
        this.buttonsService.setShowNodeForm();
        break;
      case 1:
        this.stepperCacheService.setCurrentStep(2);
        this.buttonsService.setShowEventForm();
        break;
    }
  }


  private salvarDadosFormAnterior(data: any) {
    let previosStepeStr = 'step' + this.currentStep;
    console.log('Salvando Step: ', previosStepeStr);

    this.stepperCacheService.saveStepData(<keyof StepperData>previosStepeStr, data);
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
