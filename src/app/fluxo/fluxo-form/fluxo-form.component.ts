import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FluxoService } from './fluxo.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { Subscription } from 'rxjs';
import { StepperCacheService } from '../../cytoscape/stepper/stepper-cache.service';

export interface FluxoData {
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
  selector: 'app-fluxo-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    TextareaModule,
    IftaLabelModule
  ],
  standalone: true,
  templateUrl: './fluxo-form.component.html',
  styleUrl: './fluxo-form.component.css'
})
export class FluxoFormComponent implements OnInit {
  private stepperCacheService = inject(StepperCacheService);

  private formSubscription: Subscription = new Subscription();
  private subscription: Subscription = new Subscription();

  public fluxoCreated = output<FluxoData>();
  public stepCompleted = output<boolean>();
  public formCancelled = output();

  public fluxoForm: FormGroup;
  nomeElemento = input<string>();

  constructor(private formBuilder: FormBuilder) {
    this.fluxoForm = this.formBuilder.group({
      codigoFluxo: ['', [Validators.required, Validators.minLength(2)]],
      fluxo: ['', [Validators.required, Validators.minLength(2)]],
      prazo: [''],
      parametros: [''],
      identificador: [''],
      nomeProcesso: [''],
      descricao: [''],
      dataCriacao: [''],
    });
  }

  ngOnInit(): void {
    this.setCurrentDate();
    this.loadCacheData();
    this.setupAutoSave();
  }

  private setCurrentDate(): void {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    this.fluxoForm.patchValue({
      dataCriacao: localDateTime
    });
  }

  private loadCacheData() {
    const cacheData = this.stepperCacheService.getStepData('step1');
    if (cacheData) {
      this.fluxoForm.patchValue(cacheData);
      console.log('Dados Carregados do Cache: ', cacheData);
    } else {
      console.log('Nao existe dados em cache');
    }
  }

  private setupAutoSave() {
    this.formSubscription = this.fluxoForm.valueChanges.subscribe(formData => {
      if (this.fluxoForm.valid) {
        this.saveToCache(formData);
        this.stepCompleted.emit(true);
      } else {
        this.stepCompleted.emit(false);
      }
    });
  }

   private saveToCache(formData: FluxoData) {
    this.stepperCacheService.saveStepData('step1', formData);
  }


  public saveStepData(): boolean {
    if (this.fluxoForm.valid) {
      const taskData: FluxoData = this.fluxoForm.value;
      this.saveToCache(taskData);
      return true;
    } else {
      Object.keys(this.fluxoForm.controls).forEach(key => {
        this.fluxoForm.get(key)?.markAllAsTouched();
      });
      return false;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.fluxoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }


  onSubmit(): void {
    this.saveStepData();
  }

  onCancel() {
    this.formCancelled.emit();
    this.stepperCacheService.clearCache();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  public getCurrentFormData(): FluxoData {
    return this.fluxoForm.value;
  }

  public isStepValid(): boolean {
    return this.fluxoForm.valid;
  }

}
