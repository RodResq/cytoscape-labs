import { computed, inject, Injectable, signal } from '@angular/core';
import { StepperService } from '../../cytoscape/stepper/stepper.service';
import { StepperEnum } from '../../cytoscape/stepper/steppper.enum';

@Injectable({
  providedIn: 'root'
})
export class ButtonsService {
  private stepperService = inject(StepperService);

  showFluxoFormSignal = signal<boolean>(true);
  showNodeFormSignal = signal<boolean>(false);
  showEventFormSignal = signal<boolean>(false);

  getShowNodeForm = computed(() => this.showNodeFormSignal());
  getShowFluxoForm = computed(() => this.showFluxoFormSignal());
  getShowEventForm = computed(() => this.showEventFormSignal());

  setShowFluxoForm() {
    this.showFluxoFormSignal.set(true);
    this.showNodeFormSignal.set(false);
    this.showEventFormSignal.set(false);
    this.stepperService.setNextStepper(StepperEnum.CRIAR_FLUXO);
  }

  setShowNodeForm() {
    this.showNodeFormSignal.set(true);
    this.showFluxoFormSignal.set(false);
    this.showEventFormSignal.set(false);
    this.stepperService.setNextStepper(StepperEnum.CONFIGURAR_NOS);
  }

  setShowEventForm() {
    this.showEventFormSignal.set(true);
    this.showNodeFormSignal.set(false);
    this.showFluxoFormSignal.set(false);
    this.stepperService.setNextStepper(StepperEnum.CONFIGURAR_EVENTOS);
  }

}
