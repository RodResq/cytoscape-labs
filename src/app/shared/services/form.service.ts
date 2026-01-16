import { computed, Injectable, signal } from '@angular/core';
import { FormAction } from '@shared/types/form.types';


@Injectable({
  providedIn: 'root'
})
export class FormService  {
  private formSignal = signal<FormAction>({formNumber: 0, title: '', subTitle: '', visible: false, acao: ''});

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
