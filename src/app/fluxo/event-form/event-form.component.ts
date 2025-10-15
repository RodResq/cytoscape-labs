import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { StepperService } from '../../cytoscape/stepper/stepper.service';
import { Listbox } from 'primeng/listbox';
import { TypeEvent } from './type-event';

@Component({
  selector: 'app-event-form',
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    InputGroupModule, 
    InputTextModule, 
    Checkbox,
    Listbox
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private stepperService = inject(StepperService);
  
  public tiposEventos = Object.values(TypeEvent);
  public nomeElemento: string = '';
  public eventForm: FormGroup;

  constructor() {
    this.eventForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      tipoEvento: [''],
      ativo:['true']
    });
  }

  ngOnInit(): void {
    this.nomeElemento = this.stepperService.getCurrentStepLabel();
  }

  onSubmit() {

  }
}
