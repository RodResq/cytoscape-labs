import { computed, Injectable, signal } from '@angular/core';

export interface Acao {
  formNumber: number,
  visible: boolean,
  acao: string | undefined
}

@Injectable({
  providedIn: 'root'
})
export class FluxoService  {
  private formSignal = signal<Acao>({formNumber: 0, visible: false, acao: ''});

  public readonly form = this.formSignal.asReadonly();

  
  openForm(formNumber: number) {
    this.formSignal.set({
      formNumber: formNumber,
      visible: true,
      acao: ''
    });
  }

  closeForm(formNumber: number) {
    this.formSignal.update(current => ({
      ...current,
      visible: false
    }));
  }

}
