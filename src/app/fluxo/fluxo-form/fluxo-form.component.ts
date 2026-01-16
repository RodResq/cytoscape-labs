import { Component, inject, input, OnInit, output } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsDataService } from '@shared/services/forms-data.service';
import { FluxoFormData } from '@shared/types/form.types';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Subscription } from 'rxjs';


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

  private formSubscription: Subscription = new Subscription();

  public fluxoCreated = output<FluxoFormData>();
  public stepCompleted = output<boolean>();
  public formCancelled = output();

  public fluxoForm!: FormGroup;
  nomeElemento = input<string>();

  constructor() {
    this.setupFormFluxo();
  }

  ngOnInit(): void {
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
        this.fluxoForm.patchValue(dadosParseados.form, { emitEvent: false });
      } catch (error) {
        console.error('Error ao fazer o parse dos dados do step0: ', error);
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
