import { Component, effect, inject } from '@angular/core';

import { DrawerModule } from 'primeng/drawer';

import { NodeFormComponent } from './node-form/node-form.component';
import { EventFormComponent } from './event-form/event-form.component';
import { ButtonsFormComponent } from '../shared/buttons-form/buttons-form.component';
import { FluxoService } from './fluxo-form/fluxo.service';
import { FluxoFormComponent } from './fluxo-form/fluxo-form.component';
import { StepperService } from '../cytoscape/stepper/stepper.service';
import { BuildXmlComponent } from './build-xml/build-xml.component';


@Component({
  selector: 'app-fluxo',
  imports: [
    DrawerModule,
    FluxoFormComponent,
    NodeFormComponent,
    EventFormComponent,
    BuildXmlComponent,
    ButtonsFormComponent
  ],
  templateUrl: './fluxo.component.html',
  styleUrl: './fluxo.component.css'
})
export class FluxoComponent {
  public nomeAcao: string = "";
  public drawVisible: boolean = false;

  public showFluxoForm: boolean = false;
  public showNodeForm: boolean = false;
  public showEventForm: boolean = false;
  public showBuildXml: boolean = false;

  private fluxoService = inject(FluxoService);
  private stepperService = inject(StepperService);

  constructor() {
    effect(() => {
      const fluxo = this.fluxoService.getFormSignal();
      this.drawVisible  = fluxo.visible;

      console.log('Contexto Fluxo Component: ', fluxo);

      switch (fluxo.formNumber) {
        case 0:
          this.showFluxoForm = true;
          break;
        case 1:
          this.showNodeForm = true;
          break;
        case 2:
          this.showEventForm = true;
          break;
        case 3:
          this.showBuildXml = true;
          break;
      }

      // if (fluxo.formNumber > 0) {
      //   this.showNodeForm = true;
      //   this.showFluxoForm = false;
      //   this.showEventForm = false;
      //   this.showBuildXml = false;
      // } else {
      //   this.showFluxoForm = true;
      // }

      this.nomeAcao = this.stepperService.getCurrentStepLabel();
    })
  }

}
