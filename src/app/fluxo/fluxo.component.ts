import { Component, effect, inject } from '@angular/core';

import { DrawerModule } from 'primeng/drawer';

import { NodeFormComponent } from './node-form/node-form.component';
import { EventFormComponent } from './event-form/event-form.component';
import { ButtonsFormComponent } from '../shared/buttons-form/buttons-form.component';
import { FluxoService } from './fluxo-form/fluxo.service';
import { ButtonsService } from '../shared/buttons-form/buttons.service';
import { FluxoFormComponent } from './fluxo-form/fluxo-form.component';


@Component({
  selector: 'app-fluxo',
  imports: [
    DrawerModule,
    FluxoFormComponent,
    NodeFormComponent,
    EventFormComponent,
    ButtonsFormComponent
  ],
  templateUrl: './fluxo.component.html',
  styleUrl: './fluxo.component.css'
})
export class FluxoComponent {
  public nomeAcao: string | undefined = "";
  public visible: boolean = false;

  public showFluxoForm: boolean = true;
  public showNodeForm: boolean = false;
  public showEventForm: boolean = false;

  private fluxoService = inject(FluxoService);
  private buttonsService = inject(ButtonsService);

  constructor() {
    effect(() => {
      this.showFluxoForm = this.buttonsService.getShowFluxoForm();
      this.showNodeForm = this.buttonsService.getShowNodeForm()
      this.showEventForm = this.buttonsService.getShowEventForm();
    })
  }

  ngOnInit(): void {
    this.fluxoService.acao$.subscribe(acao => {
      this.visible = acao.visible;
      this.nomeAcao = acao.acao;
    });
  }

}
