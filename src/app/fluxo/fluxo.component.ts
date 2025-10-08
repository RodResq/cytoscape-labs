import { Component, effect, inject } from '@angular/core';

import { DrawerModule } from 'primeng/drawer';

import { NodeFormComponent } from './node-form/node-form.component';
import { EventFormComponent } from './event-form/event-form.component';
import { ButtonsFormComponent } from '../shared/buttons-form/buttons-form.component';
import { FluxoService } from './fluxo-form/fluxo.service';
import { ButtonsService } from '../shared/buttons-form/buttons.service';
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
  private buttonsService = inject(ButtonsService);
  private stepperService = inject(StepperService);

  constructor() {
    effect(() => {
      this.drawVisible = this.fluxoService.getFormSignal().visible;
      
      this.showFluxoForm = this.buttonsService.getShowFluxoForm();
      this.showNodeForm = this.buttonsService.getShowNodeForm();
      this.showEventForm = this.buttonsService.getShowEventForm();
      this.showBuildXml = this.buttonsService.getShowBuildXml();
      this.nomeAcao = this.stepperService.getCurrentStepLabel();
    })
  }

}
