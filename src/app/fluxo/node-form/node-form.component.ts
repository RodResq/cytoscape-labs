import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { StepperCacheService } from '../../cytoscape/stepper/stepper-cache.service';
import { FormsDataService } from '../../services/forms-data.service';

@Component({
  selector: 'app-node-form',
  imports: [FormsModule, InputGroupModule, InputTextModule, Checkbox, ReactiveFormsModule],
  templateUrl: './node-form.component.html',
  styleUrl: './node-form.component.css'
})
export class NodeFormComponent implements OnInit{
  private formsDataService = inject(FormsDataService);
  private stepperCacheService = inject(StepperCacheService);

  nomeElemento: string = '';
  nome: string = '';
  ativo: boolean = false;

  public nodeForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.nodeForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      ativo:['true']
    });
  }

  ngOnInit(): void {
    this.setupAutoSave(this.nodeForm);
    this.loadCacheData();
  }

  setupAutoSave(form: FormGroup) {
    form.valueChanges.subscribe(formData => {
      if (formData.valid) {
        this.saveToCache(formData);
      } else {
      }
    });
  }

  private saveToCache(formData: any) {
    this.stepperCacheService.saveStepData('step2', formData);
  }

  loadCacheData() {
    const cacheData = this.stepperCacheService.getStepData('step2');
    console.log('Dados carregados do cache: ', cacheData);
    if (cacheData) {
      this.nodeForm.patchValue(cacheData);
    } else {
      console.log('Nao existe dados em chache');
    }
  }

  onSubmit() {
    this.saveStepData();
  }


  saveStepData(): boolean {
    if (this.nodeForm.valid) {
      const nodeFormData: any = this.nodeForm.value;
      this.saveToCache(nodeFormData);
      return true;
    } else {
      Object.keys(this.nodeForm.controls).forEach(key => {
        this.nodeForm.get(key)?.markAllAsTouched();
      });
      return false;
    }
  }

}


