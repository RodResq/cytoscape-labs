import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CytoscapeService {
  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  constructor() { }

  setNoElemento(elemento: any) {
    this.dataSubject.next(elemento);
  }

  getNodeTarefa() {
    return this.dataSubject.value();
  }

}
