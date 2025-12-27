import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Acao, FluxoService } from "./fluxo.service";

export const fluxoFormResolver: ResolveFn<Acao> = (route, state) => {
    const fluxoService = inject(FluxoService);
    fluxoService.openForm(0, 'Cadastrar Fluxo de Tarefa', 'Informacoes gerais sobre a que se propoe a terefa e seu objetivo final.');

    return fluxoService.form();
}
