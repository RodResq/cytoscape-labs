import { Component, effect, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Checkbox } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { FormsDataService } from '../../shared/services/forms-data.service';
import { GrafoFormData, GrafoService } from '../../shared/services/grafo.service';

@Component({
  selector: 'app-node-form',
  imports: [FormsModule, InputGroupModule, InputTextModule, Checkbox, ReactiveFormsModule, Message],
  templateUrl: './node-form.component.html',
  styleUrl: './node-form.component.css'
})
export class NodeFormComponent implements OnInit{
  private formsDataService = inject(FormsDataService);
  private formBuilder = inject(FormBuilder);
  private grafoService = inject(GrafoService);
  private activatedRoute = inject(ActivatedRoute);

  public stepCompleted = output<boolean>();

  nome: string = '';
  ativo: boolean = false;

  public nodeForm!: FormGroup;
  public grafo: GrafoFormData | null = null;

  constructor() {
    effect(() => {
      this.grafo = this.grafoService.getGrafo();

      if (this.grafo) {
        this.preencherFormTarefa();
      }




    });
    this.setupFormNode();

  }

  ngOnInit(): void {
    this.setupAutoSave();
  }

  setupFormNode() {
    this.nodeForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      ativo:['true']
    });
  }

  setupAutoSave() {
    this.nodeForm?.valueChanges.subscribe(() => {
      this.formsDataService.setFormData('step1', this.nodeForm);
    });
  }

  preencherFormTarefa() {
    const dadosStorage = localStorage.getItem('step1');

    if (dadosStorage) {
      const dadosParsed = JSON.parse(dadosStorage);
      if (Array.isArray(dadosParsed)) {
        dadosParsed
          .filter(dado => {
            const idsIguais = dado.id == this.grafo?.node.id();
            return idsIguais;
          })
          .map(dado => {
            this.nodeForm.patchValue(dado.form, {emitEvent: false})
            return dado;
          });
        };
      }
    }

}


