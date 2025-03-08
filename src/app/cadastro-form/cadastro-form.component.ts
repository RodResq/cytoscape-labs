import { CadastroService } from '../service/cadastro.service';
import { Component, inject, Input, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-form.component.html',
  styleUrl: './cadastro-form.component.css'
})
export class CadastroFormComponent {

  cadastroService = inject(CadastroService);

  @Input() grafo = '';

  // cadastrar um observable

  nodeForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    evento: new FormControl('', Validators.required),
  });

  handleSubmit() {
    let node_recuperado = this.cadastroService.getNode();
    alert('node recuperado' + node_recuperado)
    // this.cadastroService.cadastrarNode(this.nodeForm.value.nome, this.nodeForm.value.evento);
  }





}
