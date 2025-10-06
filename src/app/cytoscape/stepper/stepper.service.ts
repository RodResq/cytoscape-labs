import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StepperService {

  currentStepSignal = signal<number>(0);

  getCurrentStep = computed(() => this.currentStepSignal());

  public setNextStepper(actualStepper: number) {
    const proximoStep = actualStepper + 1;
    console.log(' Setando proximo stepper: ', proximoStep);
    this.currentStepSignal.set(proximoStep);
  }

  public setPreviousStepper() {
    this.currentStepSignal.set(this.currentStepSignal() - 1)
  }

}
