import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonsService } from '../buttons.service';
import { StepperService } from '../../../cytoscape/stepper/stepper.service';
import { StepperLabelEnum } from '../../../cytoscape/stepper/steppper.enum';

@Component({
  selector: 'app-buttons-cancel-previous',
  imports: [ButtonModule],
  templateUrl: './buttons-cancel-previous.component.html',
  styleUrl: './buttons-cancel-previous.component.css'
})
export class ButtonsCancelPreviousComponent {

  private stepperService = inject(StepperService);
  private buttonsService = inject(ButtonsService);
  labelCancelarOrAnterior: string = '';

  goTopreviousStep() {
    const currentStep = this.stepperService.getCurrentStep();
    switch(currentStep) {
      case 1:
        this.buttonsService.setShowFluxoForm();
        this.stepperService.setPreviousStepper();
        this.stepperService.setStepperLabel(StepperLabelEnum.CRIAR_FLUXO);
        break;
      case 2:
        this.buttonsService.setShowNodeForm();
        this.stepperService.setPreviousStepper();
        this.stepperService.setStepperLabel(StepperLabelEnum.CONFIGURAR_NOS);
        break;
      case 3:
        this.buttonsService.setShowEventForm();
        this.stepperService.setPreviousStepper();
        this.stepperService.setStepperLabel(StepperLabelEnum.CONFIGURAR_EVENTOS);
        break;
      default:
        this.buttonsService.setShowFluxoForm();
         this.stepperService.setPreviousStepper();
        this.stepperService.setStepperLabel(StepperLabelEnum.GERAR_XML);
        break;
    }
  }

}
