import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { StepperCacheService } from './../cytoscape/stepper/stepper-cache.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from "@angular/router";
import { StepperService } from '../cytoscape/stepper/stepper.service';
import { GrafoService } from '@shared/services/grafo.service';
import { GrafoFormData } from '@shared/types/graph.types';
import { FormService } from '@shared/services/form.service';
import { FormsDataService } from '@shared/services/forms-data.service';
import { FormAction, NodeData } from '@shared/types/form.types';
import { StepperData } from '@shared/types/stepper.types';
import { XmlEditorComponent } from '../xml-editor/xml-editor.component';
import { CytoscapeComponent } from '../cytoscape/cytoscape.component';
import { GraphReloadService } from '@shared/services/graph-reload.service';
import { filter, Subject, takeUntil } from 'rxjs';



@Component({
  selector: 'app-fluxo',
  imports: [
    RouterModule,
    CardModule,
    ButtonModule,
    RouterOutlet,
    CommonModule,
    CytoscapeComponent,
    XmlEditorComponent
],
  templateUrl: './fluxo.component.html',
  styleUrl: './fluxo.component.css'
})
export class FluxoComponent implements OnInit, OnDestroy{
  public formService = inject(FormService);
  public formsDataService = inject(FormsDataService);
  public stepperService = inject(StepperService);
  public stepperCacheService = inject(StepperCacheService);
  private grafoService = inject(GrafoService);
  private xmlSubject = inject(GraphReloadService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  public grafo!: GrafoFormData | null;
  public form!: FormAction | null;
  public idTaskNodeAtual!: string;
  public xmlCode: string = '';
  public changeUrl: boolean = false;

  constructor() {
    effect(() => {
      this.grafo = this.grafoService.getGrafo()
      this.idTaskNodeAtual =  this.activatedRoute.snapshot.queryParams['id'];

      this.form = this.formService.getForm();
      if (this.idTaskNodeAtual) {
        this.form.subTitle = this.idTaskNodeAtual;
      }
    });
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.changeUrl = true;
    })

    this.xmlSubject.xmlLoad$.subscribe(xml => {
      this.xmlCode = xml;
    });
  }

  back() {
    const currentStepper = this.stepperService.getCurrentStep();

    if (currentStepper == 3) {
      this.stepperService.setPreviousStepper();
      this.router.navigate(['/fluxoApp/event'])
    } else if (currentStepper == 2) {
      this.stepperService.setPreviousStepper();
      this.router.navigate(['/fluxoApp/node'])
    } else {
      this.stepperService.setPreviousStepper();
      this.router.navigate(['/fluxoApp/fluxo'])
    }

  }

  next() {
    this.salvarDadosFormAtual();
    this.irParaProximoStepper();
  }

  // TODO Deixar o metodo mais legivel.
  private salvarDadosFormAtual() {
    const currentStep = this.stepperService.getCurrentStep();
    const stepperLabel = <keyof StepperData>'step'.concat(currentStep.toString());
    const dadosFormulario = this.formsDataService.getFormByStep(stepperLabel);
    const dadosNodeAtual = this.salvarDadosNoNode(dadosFormulario?.value);

    if (currentStep == 1) {
      let nodesTarefaArray: Array<{}> = [];
      const itemArmazenado = localStorage.getItem('step1');

      if (itemArmazenado) {
        try {
          const dadosParsed: Array<any> = JSON.parse(itemArmazenado);

          if (Array.isArray(dadosParsed)) {
            const itemExistente = dadosParsed.some(dado => dado.id == this.grafo?.node.id());

            if (itemExistente) {
              nodesTarefaArray = dadosParsed.map(dado =>
                dado.id === this.grafo?.node.id() ? dadosNodeAtual: dado
              )
            } else {
              nodesTarefaArray = [...dadosParsed, dadosNodeAtual]
            }
          } else {
            nodesTarefaArray.push(dadosParsed);
            nodesTarefaArray.push(dadosNodeAtual);
          }
        } catch (error) {
          console.error('Erro ao fazer o parse do JSON: ', error);
        }
      } else {
        nodesTarefaArray.push(dadosNodeAtual);
      }

      localStorage.setItem(stepperLabel, JSON.stringify(nodesTarefaArray));
      this.grafo?.node.unselect();
      return;
    }

    localStorage.setItem(stepperLabel, JSON.stringify(dadosNodeAtual));
    this.grafo?.node.unselect();
  }

  private salvarDadosNoNode(dadosForm: FormGroup): NodeData {
    const nodeSelected = this.grafo?.node.select();
    nodeSelected?.data('form', dadosForm);

    return {
      id: nodeSelected?.id(),
      form: nodeSelected?.data().form
    };
  }

  private irParaProximoStepper() {
    const currentStep = this.stepperService.getCurrentStep();

    if (currentStep == 0) {
      this.router.navigate(['/fluxoApp/node']);
    } else if (currentStep == 1) {
      this.router.navigate(['/fluxoApp/event']);
    } else if (currentStep == 2) {
      this.router.navigate(['/fluxoApp/build-xml'])
    }
    this.stepperService.setNextStepper();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
