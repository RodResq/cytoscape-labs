import { Component, OnInit, effect } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

import { StepperService } from './stepper.service';


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
  standalone: true,
  imports: [ButtonModule, StepperModule]
})
export class StepperComponent implements OnInit{
  currentStep: number = 1;

  constructor(
    private stepperService: StepperService
  ) {
    effect(() => {
      this.currentStep = this.stepperService.getCurrentStep();
    })

  }

  ngOnInit(): void {
  }

}
