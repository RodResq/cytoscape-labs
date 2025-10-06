import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperCacheService } from '../../cytoscape/stepper/stepper-cache.service';
import { ButtonsService } from './buttons.service';
import { ButtonsCancelPreviousComponent } from "./buttons-cancel-previous/buttons-cancel-previous.component";
import { CommonModule } from '@angular/common';
import { StepperEnum, StepperLabelEnum } from '../../cytoscape/stepper/steppper.enum';
import { StepperService } from '../../cytoscape/stepper/stepper.service';

@Component({
  selector: 'app-buttons-form',
  imports: [ButtonModule, ButtonsCancelPreviousComponent, CommonModule],
  templateUrl: './buttons-form.component.html',
  styleUrl: './buttons-form.component.css'
})
export class ButtonsFormComponent {

  private stepperCacheService = inject(StepperCacheService);
  private stepperService = inject(StepperService);
  private buttonsService = inject(ButtonsService);

  currentStep: number = 1;

  labelCancelarOrAnterior: string = 'Cancelar';

  canProceedToNextStep(): boolean {
    switch(this.currentStep) {
      case 1:
        return true;
      case 2:
        return true
      case 3:
        return true
      default:
        return true;
    }
  }

  goToNextStep(): void {
    this.currentStep = this.stepperService.getCurrentStep();
    this.labelCancelarOrAnterior = 'Anterior';

    this.stepperService.setNextStepper(this.currentStep);

    switch(this.currentStep) {
      case StepperEnum.CRIAR_FLUXO:
        console.log('Clicou no Proximo');

        this.buttonsService.setShowNodeForm();
        this.stepperService.setStepperLabel(StepperLabelEnum.CONFIGURAR_NOS);
        break;
      case StepperEnum.CONFIGURAR_NOS:
        this.buttonsService.setShowEventForm();
        this.stepperService.setStepperLabel(StepperLabelEnum.CONFIGURAR_EVENTOS);
        break;
      case StepperEnum.CONFIGURAR_EVENTOS:
        this.buttonsService.setShowBuildXml();
        this.stepperService.setStepperLabel(StepperLabelEnum.GERAR_XML);
        break;
      }
  }

  finishStepper(): void {
    if (this.validateAllSteps()) {
      const allData = this.stepperCacheService.submitAllData();
      console.log('Dados Finais submetidos: ', allData);
    } else {
      alert('Complete todos os steps antes de finalizar');
    }
  }

  validateAllSteps(): boolean {
    return this.stepperCacheService.areAllStepsValid();
  }

}
