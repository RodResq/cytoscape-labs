import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { TaskService } from './task.service';
import { CytoscapeService } from '../cytoscape/cytoscape.service';
import { Subscription } from 'rxjs';

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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  @Input() nomeElemento: string = '';
  @Output() taskCreated = new EventEmitter<TaskData>();
  @Output() formCancelled = new EventEmitter<void>();
  private subscription: Subscription = new Subscription();
  private receivedNode: any = {};


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
    this.cytoscapeService.data$.subscribe(node => {
      const taskData = node.data().taskData;
      if (taskData) {
        console.log('No recebido no form no IF', taskData);

        this.taskForm.setValue(taskData);
        this.taskForm.disable();
      } else {
        console.log('No recebido no form no ELSE', taskData);
        this.resetForm();
        this.taskForm.enable();
      }
    });

    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    this.taskForm.patchValue({
      dataCriacao: localDateTime
    });
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
