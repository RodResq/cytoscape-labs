import { StepperService } from './stepper.service';
import { StepperCacheService } from './../../task-form/stepper-cache.service';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

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
  ) {}

  ngOnInit(): void {
    this.stepperService.stepperData$.subscribe(step => {
      this.currentStep = step
    })
  }

}
