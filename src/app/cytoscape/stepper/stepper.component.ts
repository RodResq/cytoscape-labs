import { Component, OnInit, effect, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

import { StepperService } from './stepper.service';
import { StepperLabelEnum } from './steppper.enum';


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
  standalone: true,
  imports: [ButtonModule, StepperModule]
})
export class StepperComponent implements OnInit{
  private stepperService = inject(StepperService);

  currentStep: number = 0;
  steps = Object.values(StepperLabelEnum);

  constructor() {
    effect(() => {
      this.currentStep = this.stepperService.getCurrentStep();
    });
  }

  ngOnInit(): void {
    this.stepperService.setStepperByIndex(Number(this.steps[0]));
  }

}
