import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskData } from './task-form.component';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  constructor() { }

  atualizarDadoElemento(taskData: TaskData) {
    this.dataSubject.next(taskData);
  }

  getTaskFormData() {
    return this.dataSubject.value();
  }
}
