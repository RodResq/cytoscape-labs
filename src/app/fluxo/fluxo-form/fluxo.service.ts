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
  getFormSignal = computed(() => this.formSignal());

  openForm(formNumber: number) {
    this.formSignal.set({
      formNumber: formNumber,
      visible: true,
      acao: ''
    });
  }

  hiddenForm(formNumber: number) {
    this.formSignal.set({
      formNumber: formNumber,
      visible: false,
      acao: ''
    });
  }

}
