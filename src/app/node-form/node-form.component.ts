import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { NodeService } from './node.service';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-node-form',
  imports: [FormsModule, InputGroupModule, InputTextModule, Checkbox],
  templateUrl: './node-form.component.html',
  styleUrl: './node-form.component.css'
})
export class NodeFormComponent implements OnInit{

  nomeElemento: string = '';
  nome: string = '';
  ativo: boolean = false;

  constructor(private nodeService: NodeService) {}


  ngOnInit(): void {
    const elementoSelecionado = this.nodeService.getElementoSelecionado();
    if (elementoSelecionado) {
      this.nomeElemento = elementoSelecionado.id();
    }

  }

}
