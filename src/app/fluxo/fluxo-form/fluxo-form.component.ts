import { Component, inject, input, OnInit, output } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Subscription } from 'rxjs';
import { FormsDataService } from '../../shared/services/forms-data.service';
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
  private formsDataService = inject(FormsDataService);
  private formBuilder = inject(FormBuilder);
  private stepperService = inject(StepperCacheService)

  private formSubscription: Subscription = new Subscription();

  public fluxoCreated = output<FluxoData>();
  public stepCompleted = output<boolean>();
  public formCancelled = output();

  public fluxoForm!: FormGroup;
  nomeElemento = input<string>();

  constructor() {
    this.setupFormFluxo();
  }

  ngOnInit(): void {

    const savedForm = this.formsDataService.getFormByStep('step0');
    if (savedForm) {
      localStorage.setItem('step0', JSON.stringify(savedForm.value));
      this.fluxoForm.patchValue(savedForm.value, {emitEvent: false});
    }

    this.setCurrentDate();
    this.setupAutoSave();
  }

  setupFormFluxo() {
    this.fluxoForm = this.formBuilder.group({
      fluxo: ['', [Validators.required, Validators.minLength(2)]],
      descricao: [''],
      dataCriacao: [''],
    });

    const dadosFormalarioSalvo = localStorage.getItem('step0');

    if (dadosFormalarioSalvo) {
      try {
        const dadosParseados = JSON.parse(dadosFormalarioSalvo);
        this.fluxoForm.patchValue(dadosParseados, { emitEvent: false });
      } catch (error) {
        console.error('Error ao fazer o parse dos dados do localStorage: ', error);
      }
    }
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
      this.formsDataService.setFormData('step0' , this.fluxoForm);
    })
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  public isStepValid(): boolean {
    return this.fluxoForm.valid;
  }

}
