import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperCacheService } from '../../../cytoscape/stepper/stepper-cache.service';
import { ButtonsService } from '../buttons.service';
import { FormsDataService } from '../../../services/forms-data.service';

@Component({
  selector: 'app-buttons-cancel-previous',
  imports: [ButtonModule],
  templateUrl: './buttons-cancel-previous.component.html',
  styleUrl: './buttons-cancel-previous.component.css'
})
export class ButtonsCancelPreviousComponent {

  private stepperCacheService = inject(StepperCacheService);
  private buttonsService = inject(ButtonsService);
  labelCancelarOrAnterior: string = '';

  goTopreviousStep() {
    switch(this.stepperCacheService.getCurrentStep()) {
      case 1:
        this.labelCancelarOrAnterior = 'Cancelar';
        this.buttonsService.setShowFluxoForm();
        break;
      case 2:
        this.buttonsService.setShowNodeForm();
        break;
      case 3:
        this.buttonsService.setShowEventForm();
        break;
      default:
        this.buttonsService.setShowFluxoForm();
        break;
    }
  }

}
