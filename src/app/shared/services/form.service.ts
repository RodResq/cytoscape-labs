import { computed, Injectable, signal } from '@angular/core';

export interface Acao {
  title: string,
  subTitle: string | null,
  formNumber: number,
  visible: boolean,
  acao: string | undefined
}

@Injectable({
  providedIn: 'root'
})
export class FormService  {
  private formSignal = signal<Acao>({formNumber: 0, title: '', subTitle: '', visible: false, acao: ''});

  getForm = computed(() => this.formSignal());

  openForm(formNumber: number, title: string, subTitle: string | null) {
    this.formSignal.set({
      formNumber: formNumber,
      title: title,
      subTitle: subTitle,
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
