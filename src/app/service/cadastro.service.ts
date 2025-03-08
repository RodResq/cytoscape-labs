import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  public node: any;

  constructor() { }

  cadastrarNode(nome: any, evento: any) {
    alert('Node cadastrado' + nome + ', evento: ' + evento)
  }


  setNode(node: any) {
    this.node = node;
    alert('node cadastrado: ' + this.node)
  }

  getNode() {
    return this.node;
  }

}
