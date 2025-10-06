import { computed, Injectable, signal } from '@angular/core';

export interface Acao {
  visible: boolean,
  acao: string | undefined
}

@Injectable({
  providedIn: 'root'
})
export class FluxoService  {
  private formSignal = signal<Acao>({visible: false, acao: ''});
  getFormSignal = computed(() => this.formSignal());

  openForm() {
    this.formSignal.set({
      visible: true,
      acao: ''
    });
  }


}
