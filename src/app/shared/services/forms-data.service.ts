import { Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepperData } from '../../cytoscape/stepper/stepper-cache.service';

@Injectable({
  providedIn: 'root'
})
export class FormsDataService {

  formData = signal<Partial<Record<keyof StepperData, FormGroup>>>({});

  setFormData(step: keyof StepperData, formData: FormGroup) {
    const currentData = this.formData();
    const updateData = {
      ...currentData,
      [step]: formData
    };
    this.formData.set(updateData);
  }

  getFormByStep(step: keyof StepperData): FormGroup {
    return <FormGroup>this.formData()[step];
  }

  clearFormData(step: keyof StepperData) {
    this.formData.update(currentData => {
      const { [step]: removed, ...rest } = currentData;
      return rest;
    });
  }

  clearAllForms() {
    this.formData.set({});
  }

}
