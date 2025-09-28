import { BehaviorSubject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  getELement(element: any) {
    this.dataSubject.next(element);
  }

  getElementoSelecionado() {
    return this.dataSubject.value;
  }
}
