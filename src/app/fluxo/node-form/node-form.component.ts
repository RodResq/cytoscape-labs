import { Component, effect, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { StepperService } from '../../cytoscape/stepper/stepper.service';
import { FormsDataService } from '../../shared/services/forms-data.service';

@Component({
  selector: 'app-node-form',
  imports: [FormsModule, InputGroupModule, InputTextModule, Checkbox, ReactiveFormsModule],
  templateUrl: './node-form.component.html',
  styleUrl: './node-form.component.css'
})
export class NodeFormComponent implements OnInit{
  private formsDataService = inject(FormsDataService);
  private stepperService = inject(StepperService);
  private formBuilder = inject(FormBuilder);

  public stepCompleted = output<boolean>();

  nomeElemento: string = '';
  nome: string = '';
  ativo: boolean = false;

  public nodeForm!: FormGroup;

  constructor() {
    effect(() => {
      this.nomeElemento = this.stepperService.getCurrentStepLabel();
    })
  }

  ngOnInit(): void {
    console.log('Instanciou o nodeForm');
    this.setupFormNode();
    this.setupAutoSave();
  }

  setupFormNode() {
    this.nodeForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      ativo:['true']
    });

    const savedData = this.formsDataService.getFormByStep('step1');
    if (savedData) {
        localStorage.setItem('step1', JSON.stringify(savedData.value));
        this.nodeForm.patchValue(savedData.value, {emitEvent: false});
      }
  }

  setupAutoSave() {
    this.nodeForm.valueChanges.subscribe(() => {
      this.formsDataService.setFormData('step1', this.nodeForm);

      this.stepCompleted.emit(this.nodeForm.valid);
    });
  }

}


