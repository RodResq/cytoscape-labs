import { Component, effect, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperCacheService } from '../../cytoscape/stepper/stepper-cache.service';
import { ButtonsService } from './buttons.service';
import { ButtonsCancelPreviousComponent } from "./buttons-cancel-previous/buttons-cancel-previous.component";
import { CommonModule } from '@angular/common';
import { StepperEnum, StepperLabelEnum } from '../../cytoscape/stepper/steppper.enum';
import { StepperService } from '../../cytoscape/stepper/stepper.service';
import { GrafoFormData, GrafoService } from '../../services/grafo.service';

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
  private grafoService = inject(GrafoService);

  private currentStep: number = 0;
  private currentGrafoFormData: GrafoFormData | null = null;

  labelCancelarOrAnterior: string = 'Cancelar';

  constructor() {
    effect(() => this.currentGrafoFormData = this.grafoService.getGrafo());
  }

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

    if (this.currentGrafoFormData?.length == 1) {
      alert('Primeiramente adicione um no no grafo!');
      return;
    }

    console.clear();
    this.currentGrafoFormData?.node.select();
    const idParentNode = this.currentGrafoFormData?.node.data('idParentNode');
    const parenteNode = this.currentGrafoFormData?.collection.getElementById(idParentNode)
    parenteNode?.unselect();
    console.log('Tentattiva get parente No -> Context Btn:', parenteNode);


    this.stepperService.setNextStepper(this.currentStep);
    switch(this.currentStep) {
      case StepperEnum.CRIAR_FLUXO:
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
