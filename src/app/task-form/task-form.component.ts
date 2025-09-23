import { StepperCacheService } from './stepper-cache.service';
import { Component, EventEmitter, input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { Subscription } from 'rxjs';
import { CytoscapeService } from '../graph/cytoscape.service';

export interface TaskData {
  codigoFluxo: string;
  fluxo: string;
  prazo?: string;
  parametros?: string;
  identificador?: string;
  nomeProcesso?: string;
  descricao?: string;
  dataCriacao?: string;
}

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    TextareaModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit, OnDestroy {
  nomeElemento = input<string>();
  @Output() taskCreated = new EventEmitter<TaskData>();
  @Output() formCancelled = new EventEmitter<void>();
  @Output() stepCompleted = new EventEmitter<boolean>();

  private subscription: Subscription = new Subscription();
  private formSubscription: Subscription = new Subscription();

  taskForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cytoscapeService: CytoscapeService,
    private stepperCacheService: StepperCacheService) {
    this.taskForm = this.formBuilder.group({
      codigoFluxo: ['', [Validators.required, Validators.minLength(2)]],
      fluxo: ['', [Validators.required, Validators.minLength(2)]],
      prazo: [''],
      parametros: [''],
      identificador: [''],
      nomeProcesso: [''],
      descricao: [''],
      dataCriacao: [''],
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  ngOnInit(): void {
    this.setCurrentDate();
    this.loadCacheData();
    this.setupAutoSave();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  loadCacheData() {
    const cacheData = this.stepperCacheService.getStepData('step1');
    if (cacheData) {
      this.taskForm.patchValue(cacheData);
      console.log('Dados Carregados do Cache: ', cacheData);
    } else {
      console.log('Nao existe dados em cache');
    }
  }

  private setupAutoSave() {
    this.formSubscription = this.taskForm.valueChanges.subscribe(formData => {
      if (this.taskForm.valid) {
        this.saveToCache(formData);
        this.stepCompleted.emit(true);
      } else {
        this.stepCompleted.emit(false);
      }
    });
  }

  private saveToCache(formData: TaskData) {
    this.stepperCacheService.saveStepData('step1', formData);
  }

  public saveStepData(): boolean {
    if (this.taskForm.valid) {
      const taskData: TaskData = this.taskForm.value;
      this.saveToCache(taskData);
      return true;
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAllAsTouched();
      });
      return false;
    }
  }

  onSubmit(): void {
    this.saveStepData();
  }

  private setCurrentDate(): void {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    this.taskForm.patchValue({
      dataCriacao: localDateTime
    });
  }

  onCancel() {
    this.formCancelled.emit();
    this.stepperCacheService.clearCache();
  }

  public isStepValid(): boolean {
    return this.taskForm.valid;
  }

  public getCurrentFormData(): TaskData {
    return this.taskForm.value;
  }

}
