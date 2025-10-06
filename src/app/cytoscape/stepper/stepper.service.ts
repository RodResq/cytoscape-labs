import { computed, Injectable, signal } from '@angular/core';
import { StepperLabelEnum } from './steppper.enum';

@Injectable({
  providedIn: 'root'
})
export class StepperService {

  currentStepSignal = signal<number>(0);
  currentStepLabel = signal<string>(StepperLabelEnum.CRIAR_FLUXO);

  getCurrentStep = computed(() => this.currentStepSignal());
  getCurrentStepLabel = computed(() => this.currentStepLabel());

  public setNextStepper(actualStepper: number) {
    const proximoStep = actualStepper + 1;
    this.currentStepSignal.set(proximoStep);
  }

  public setPreviousStepper() {
    this.currentStepSignal.set(this.currentStepSignal() - 1)
  }

  public setStepperLabel(value: string) {
    this.currentStepLabel.set(value);
  }

}
