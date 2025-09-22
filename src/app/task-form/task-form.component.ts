import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
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


interface City {
    name: string;
    code: string;
}

@Component({
  selector: 'app-task-form',
  imports: [FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, SelectModule, InputNumberModule, TextareaModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  nomeElemento = input<string>();
  @Output() taskCreated = new EventEmitter<TaskData>();
  @Output() formCancelled = new EventEmitter<void>();
  private subscription: Subscription = new Subscription();
  private receivedNode: any = {};

  text1: string | undefined;
  text2: string | undefined;
  number: string | undefined;
  selectedCity: City | undefined;
  cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' },
    ];

  taskForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cytoscapeService: CytoscapeService) {
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
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData: TaskData = this.taskForm.value;
      this.subscription = this.cytoscapeService.data$.subscribe(node => {
        this.receivedNode = node;
      });
      this.receivedNode.data({taskData})
      this.resetForm();
      this.subscription.unsubscribe();
    }
  }

  private resetForm() {
    this.taskForm.reset();
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    this.taskForm.patchValue({
      dataCriacao: localDateTime
    })
  }

  onCancel() {
    this.formCancelled.emit();
    this.subscription.unsubscribe();
    this.resetForm();
  }

}
