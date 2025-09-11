import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';

export interface TaskData {
  nomeTarefa: string;
  dataCriacao: string;
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


  taskForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.taskForm = this.formBuilder.group({
      nomeTarefa: ['', [Validators.required, Validators.minLength(2)]],
      dataCriacao: ['', Validators.required]
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  ngOnInit(): void {
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
      this.taskCreated.emit(taskData);
      this.resetForm();
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
    this.resetForm();
  }

}
