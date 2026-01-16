import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { StepperService } from "../../cytoscape/stepper/stepper.service";
import { FormAction } from "@shared/types/form.types";
import { FormService } from "@shared/services/form.service";

export const fluxoFormResolver: ResolveFn<FormAction> = (route, state) => {
    const fluxoService = inject(FormService);
    const stepperService = inject(StepperService);

    const currentStep = stepperService.getCurrentStep();
    const hasId = route.queryParamMap.has('id');

    if (currentStep == 0) {
      fluxoService.openForm(0, hasId ?
        'Editar Fluxograma': 'Cadastrar Fluxograma',
        'Informacoes gerais sobre a que se propoe a terefa e seu objetivo final.');
    } else {
      fluxoService.openForm(1, hasId ?
        'Editar Tarefa':
        'Cadastrar Tarefas', route.queryParamMap.get('id'));
    }


    return fluxoService.getForm();
}
