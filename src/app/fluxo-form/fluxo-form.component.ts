import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrawerModule } from 'primeng/drawer';

import { FluxoService } from './fluxo.service';

import { EventFormComponent } from '../event-form/event-form.component';
import { NodeFormComponent } from '../node-form/node-form.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ButtonsFormComponent } from "../shared/buttons-form/buttons-form.component";
import { ButtonsService } from '../shared/buttons-form/buttons.service';

@Component({
  selector: 'app-fluxo-form',
  imports: [DrawerModule, CommonModule, TaskFormComponent, NodeFormComponent, EventFormComponent, ButtonsFormComponent],
  standalone: true,
  templateUrl: './fluxo-form.component.html',
  styleUrl: './fluxo-form.component.css'
})
export class FluxoFormComponent implements OnInit {
  private fluxoService = inject(FluxoService);
  private buttonsService = inject(ButtonsService)

  showFluxoForm: boolean = true;
  showNodeForm: boolean = false;
  showEventForm: boolean = false;

  visible: boolean = false;
  nomeAcao: string | undefined = "";

  constructor() {
    effect(() => {
      this.showNodeForm = this.buttonsService.getShowFormNode();
      this.showFluxoForm = this.buttonsService.getShowFluxoForm();
      this.showEventForm = this.buttonsService.getShowEventForm();
    });
  }

  ngOnInit(): void {
    this.fluxoService.acao$.subscribe(acao => {
      this.visible = acao.visible;
      this.nomeAcao = acao.acao;
    });
  }

}
