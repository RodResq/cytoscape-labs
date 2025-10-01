import { BehaviorSubject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

export interface Acao {
  visible: boolean,
  acao: string | undefined
}

@Injectable({
  providedIn: 'root'
})
export class FluxoService implements OnDestroy {

  private acao = new BehaviorSubject<Acao>({visible: false, acao:''});
  public acao$ = this.acao.asObservable();

  constructor() {}

  setAcao(acao: string | undefined) {
    console.log('Ação clicada: ', acao);
    this.acao.next({
      visible: true,
      acao: acao
    });
  }

  ngOnDestroy(): void {
    this.acao.unsubscribe();
  }
  
}
