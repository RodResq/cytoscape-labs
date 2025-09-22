import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-fluxo-form',
  imports: [ButtonModule, StepperModule, CommonModule, TaskFormComponent],
  standalone: true,
  templateUrl: './fluxo-form.component.html',
  styleUrl: './fluxo-form.component.css'
})
export class FluxoFormComponent {

    showTaskForm: boolean = true;
}
