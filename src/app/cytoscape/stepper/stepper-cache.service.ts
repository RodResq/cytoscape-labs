/**
 * Servico responsavel por guarda gerenciar o estado do formulario de acordo com o stepper e salva-los no local storage
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { FluxoData } from '../../fluxo/fluxo-form/fluxo-form.component';


export interface StepperData {
  step0?: FluxoData,
  step1?: any;
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
    return !!(data.step0 && data.step1 && data.step2 && data.step3);
  }

  setNextStep(currentStep: number) {
    this.currentStepSubject.next(currentStep);
  }

  getCurrentStep(): number {
    return this.currentStepSubject.value;
  }

  getCurrentStepObject() {
    return this.currentStepSubject;
  }

}
