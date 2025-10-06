import { Component, effect, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { FormsDataService } from '../../services/forms-data.service';

@Component({
  selector: 'app-node-form',
  imports: [FormsModule, InputGroupModule, InputTextModule, Checkbox, ReactiveFormsModule],
  templateUrl: './node-form.component.html',
  styleUrl: './node-form.component.css'
})
export class NodeFormComponent implements OnInit{
  private formsDataService = inject(FormsDataService);
  public stepCompleted = output<boolean>();

  nomeElemento: string = 'Node Forms Works';
  nome: string = '';
  ativo: boolean = false;

  public nodeForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.nodeForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      ativo:['true']
    });

    effect(() => {
      const savedData = this.formsDataService.getFormByStep('step2');
      if (savedData) {
        console.log('Dados do step1: ', this.formsDataService.getFormByStep('step1').value);
        console.log('Dados do step2: ', savedData.value);

        this.nodeForm.patchValue(savedData.value, {emitEvent: false});
      }
    })
  }

  ngOnInit(): void {
    this.setupAutoSave();
  }

  setupAutoSave() {
    this.nodeForm.valueChanges.subscribe(() => {
      this.formsDataService.setFormData('step2', this.nodeForm);

      this.stepCompleted.emit(this.nodeForm.valid);
    });
  }

  onSubmit() {
  }

}


