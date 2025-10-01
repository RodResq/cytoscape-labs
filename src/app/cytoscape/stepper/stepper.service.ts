import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StepperService {

  currentStepSignal = signal<number>(1);

  getCurrentStep = computed(() => this.currentStepSignal());

  public setNextStepper(actualStepper: number) {
    this.currentStepSignal.set(actualStepper);
  }

  public setPreviousStepper() {
    this.currentStepSignal.set(this.currentStepSignal() - 1)
  }

}
