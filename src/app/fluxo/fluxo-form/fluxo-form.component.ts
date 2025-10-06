import { Component, effect, inject, input, OnInit, output } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { Subscription } from 'rxjs';
import { FormsDataService } from '../../services/forms-data.service';

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
  private formsDataService = inject(FormsDataService);

  private formSubscription: Subscription = new Subscription();

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

    effect(() => {
      const savedForm = this.formsDataService.getFormByStep('step1');
      if (savedForm) {
        this.fluxoForm.patchValue(savedForm.value, {emitEvent: false});
      }
    })
  }

  ngOnInit(): void {
    this.setCurrentDate();
    this.setupAutoSave();
  }

  private setCurrentDate(): void {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    this.fluxoForm.patchValue({
      dataCriacao: localDateTime
    }, { emitEvent: false });
  }

  private setupAutoSave() {
    this.formSubscription = this.fluxoForm.valueChanges.subscribe(() => {
      this.formsDataService.setFormData('step1', this.fluxoForm);

      this.stepCompleted.emit(this.fluxoForm.valid);
    })
  }

  onSubmit(): void {
    console.log('Salvando dados no onSubmit: ', this.fluxoForm);
  }

  onCancel() {
    this.formCancelled.emit();
    this.formsDataService.clearFormData('step1');
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  public isStepValid(): boolean {
    return this.fluxoForm.valid;
  }

}
