import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FluxoData } from '../../fluxo/fluxo-form/fluxo-form.component';


export interface StepperData {
  step1?: FluxoData,
  step2?: any;
  step3?: any;
}

@Injectable({
  providedIn: 'root'
})
export class StepperCacheService {
  private stepperDataSubject = new BehaviorSubject<StepperData>({});
  private currentStepSubject = new BehaviorSubject<number>(0);
  public stepperData$ = this.stepperDataSubject.asObservable();

  constructor() {}

  saveStepData(step: keyof StepperData, data: any): void {
    const currentData = this.stepperDataSubject.value;
    const updateData = {
      ...currentData,
      [step]: data
    };
    this.stepperDataSubject.next(updateData);
    // this.formsDataService.setFormData(data)
  }

  getStepData(step: keyof StepperData) {
    return this.stepperDataSubject.value[step];
  }

  getAllStepperData(): StepperData {
    return this.stepperDataSubject.value;
  }

  clearCache() {
    this.stepperDataSubject.next({});
    console.log('Cache do Stepper Limpo');
  }

  submitAllData() {
    const allData = this.stepperDataSubject.value;
    this.sendToServer(allData);

    return allData;
  }

  sendToServer(data: StepperData) {
     console.log('Enviando para servidor:', data);
  }

  isStepValid(step: keyof StepperData): boolean {
    const stepData = this.getStepData(step);

    return stepData && Object.keys(stepData).length > 0;
  }

  areAllStepsValid(): boolean {
    const data = this.stepperDataSubject.value;
    return !!(data.step1 && data.step2 && data.step3);
  }

  setNextStep(currentStep: number) {
    this.currentStepSubject.next(currentStep);
  }

  getCurrentStep(): number {
    return this.currentStepSubject.value;
  }

}
