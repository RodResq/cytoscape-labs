import { computed, inject, Injectable, signal } from '@angular/core';
import { StepperService } from '../../cytoscape/stepper/stepper.service';
import { StepperEnum } from '../../cytoscape/stepper/steppper.enum';

@Injectable({
  providedIn: 'root'
})
export class ButtonsService {
  private stepperService = inject(StepperService);

  showFluxoFormSignal = signal<boolean>(true);
  showFormNodeSignal = signal<boolean>(false);
  showEventFormSignal = signal<boolean>(false);

  getShowFormNode = computed(() => this.showFormNodeSignal());
  getShowFluxoForm = computed(() => this.showFluxoFormSignal());
  getShowEventForm = computed(() => this.showEventFormSignal());

  setShowFluxoForm() {
    this.showFluxoFormSignal.set(true);
    this.showFormNodeSignal.set(false);
    this.showEventFormSignal.set(false);
    this.stepperService.setNextStepper(StepperEnum.CRIAR_FLUXO);
  }

  setShowNodeForm() {
    this.showFormNodeSignal.set(true);
    this.showFluxoFormSignal.set(false);
    this.showEventFormSignal.set(false);
    this.stepperService.setNextStepper(StepperEnum.CONFIGURAR_NOS);
  }

  setShowEventForm() {
    this.showEventFormSignal.set(true);
    this.showFormNodeSignal.set(false);
    this.showFluxoFormSignal.set(false);
    this.stepperService.setNextStepper(StepperEnum.CONFIGURAR_EVENTOS);
  }

}
