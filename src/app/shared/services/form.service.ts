import { Injectable, signal } from '@angular/core';

export interface Acao {
  title: string,
  subTitle: string,
  formNumber: number,
  visible: boolean,
  acao: string | undefined
}

@Injectable({
  providedIn: 'root'
})
export class FormService  {
  private formSignal = signal<Acao>({formNumber: 0, title: '', subTitle: '', visible: false, acao: ''});

  public readonly form = this.formSignal.asReadonly();


  openForm(formNumber: number, title: string, subTitle: string) {
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
