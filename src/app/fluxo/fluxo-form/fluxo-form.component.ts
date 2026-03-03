import { Component, inject, input, OnInit, output } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsDataService } from '@shared/services/forms-data.service';
import { FluxoFormData } from '@shared/types/form.types';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fluxo-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    IftaLabelModule,
    ButtonModule
  ],
  standalone: true,
  templateUrl: './fluxo-form.component.html',
  styleUrl: './fluxo-form.component.css'
})
export class FluxoFormComponent implements OnInit {
  nodeEditForm!: FormGroup;
  formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.nodeEditForm = this.formBuilder.group({
      nome: [''],
    });
  }

  ngOnDestroy(): void {
  }

  public salvar() {
    console.log('Salvando dados do node');
    
  }

}
