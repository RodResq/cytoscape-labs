import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FluxoService {

  private statusDrawer = new BehaviorSubject<boolean>(false);
  public status$ = this.statusDrawer.asObservable();

  constructor() {}

  openDrawer() {
    console.log('Abrindo o drawer');
    return this.statusDrawer.next(true);
  }

  getStatusDrawer() {
    return this.statusDrawer.value;
  }
  
}
