import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Acao, FluxoService } from "./fluxo.service";
import { StepperService } from "../../cytoscape/stepper/stepper.service";

export const fluxoFormResolver: ResolveFn<Acao> = (route, state) => {
    const fluxoService = inject(FluxoService);
    const stepperService = inject(StepperService);

    const currentStep = stepperService.getCurrentStep();

    if (currentStep == 0) {
      fluxoService.openForm(0, 'Cadastrar Fluxo de Tarefa', 'Informacoes gerais sobre a que se propoe a terefa e seu objetivo final.');
    } else {
      fluxoService.openForm(0, 'Cadastrar Tarefas', '');
    }


    return fluxoService.form();
}
