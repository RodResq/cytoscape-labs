import { Component, effect, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsDataService } from '@shared/services/forms-data.service';
import { GrafoService } from '@shared/services/grafo.service';
import { GrafoFormData } from '@shared/types/graph.types';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-node-form',
  imports: [ReactiveFormsModule, InputGroupModule, InputTextModule, ButtonModule, InputNumberModule],
  templateUrl: './node-form.component.html',
  styleUrl: './node-form.component.css',
  standalone: true
})
export class NodeFormComponent implements OnInit {
  private formsDataService = inject(FormsDataService);
  private formBuilder = inject(FormBuilder);
  private grafoService = inject(GrafoService);

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

      const nodeEditado = this.grafoService.getNode();

      if (nodeEditado) {
        const xmlRepresentation = nodeEditado.data('xmlRepresentation');

        if (xmlRepresentation) {
          this.nodeForm?.patchValue({
            name: xmlRepresentation.name,
            task: {
              name: xmlRepresentation.name,
              swimlane: xmlRepresentation.swimlane,
              priority: xmlRepresentation.priority
            }
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.setupFormNode();
    this.setupAutoSave();
  }

  setupFormNode() {
    this.nodeForm = this.formBuilder.group({
      name: new FormControl(''),
      task: this.formBuilder.group({
        name: new FormControl(''),
        swmlane: new FormControl(''),
        priority: new FormControl(''),
      })
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
            this.nodeForm.patchValue(dado.form, { emitEvent: false })
            return dado;
          });
      };
    }
  }

  onSubmit() {
    this.formsDataService.setFormData('step1', this.nodeForm);
  }

}
