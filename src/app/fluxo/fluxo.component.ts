import { Component, effect, inject } from '@angular/core';

import { DrawerModule } from 'primeng/drawer';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { StepperService } from '../cytoscape/stepper/stepper.service';
import { ButtonsFormComponent } from '../shared/buttons-form/buttons-form.component';
import { FluxoFormTypeEnum } from './fluxo-form-type.enum';
import { FluxoService } from './fluxo-form/fluxo.service';


@Component({
  selector: 'app-fluxo',
  imports: [
    RouterModule,
    CardModule,
    ButtonModule,
    RouterOutlet
],
  templateUrl: './fluxo.component.html',
  styleUrl: './fluxo.component.css'
})
export class FluxoComponent {
  private fluxoService = inject(FluxoService);
  private stepperService = inject(StepperService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public nomeAcao: string = "";
  public drawVisible: boolean = false;

  public showFluxoForm: boolean = false;
  public showNodeForm: boolean = false;
  public showEventForm: boolean = false;
  public showBuildXml: boolean = false;


  constructor() {
    effect(() => {
      const fluxo = this.fluxoService.getFormSignal();
      this.drawVisible  = fluxo.visible;

      console.log('Contexto Fluxo Component: ', fluxo);

      switch (fluxo.formNumber) {
        case FluxoFormTypeEnum.FLUXO_FORM:
          this.router.navigate(['fluxo'], { relativeTo: this.route});
          break;
        case FluxoFormTypeEnum.NODE_FORM:
          this.router.navigate(['node'], { relativeTo: this.route});
          this.showFluxoForm = false;
          break;
        case FluxoFormTypeEnum.EVENT_FORM:
          this.showNodeForm = !this.showNodeForm;
          this.showEventForm = true;
          break;
        case FluxoFormTypeEnum.BUILD_XML_FORM:
          this.showBuildXml = true;
          break;
      }

      this.nomeAcao = this.stepperService.getCurrentStepLabel();
    })
  }

}
