import { StepperCacheService } from './../../task-form/stepper-cache.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepperService {

  private stepperSubscription = new BehaviorSubject<number>(1);
  public stepperData$ = this.stepperSubscription.asObservable();

  constructor(private stepperCacheService: StepperCacheService) {}

  public setNextStepper(actualStepper: number) {
    this.stepperSubscription.next(++actualStepper);
  }

  public setPreviosStepper() {
    let currentStep: number = this.stepperCacheService.getCurrentStep();
    this.stepperSubscription.next(--currentStep);
  }

}
