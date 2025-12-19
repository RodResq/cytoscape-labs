import { computed, Injectable, signal } from '@angular/core';
import { StepperLabelEnum } from './steppper.enum';

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  private steps = Object.values(StepperLabelEnum);

  currentStepSignal = signal<number>(0);
  currentStepLabel = computed(() => this.steps[this.currentStepSignal()])

  getCurrentStep = computed(() => this.currentStepSignal());
  getCurrentStepLabel = computed(() => this.currentStepLabel());

  public setNextStepper() {
    if (this.currentStepSignal() < this.steps.length - 1) {
      this.currentStepSignal.update(value => value + 1)
    }
  }

  public setPreviousStepper() {
    if (this.currentStepSignal() > 0) {
      this.currentStepSignal.update(value => value -1)
    }
  }

  public setStepperByIndex(index: number) {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepSignal.set(index);
    }
  }

}
