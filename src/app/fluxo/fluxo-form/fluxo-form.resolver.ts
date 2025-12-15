import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { FluxoService } from "./fluxo.service";

export const fluxoFormResolver: ResolveFn<boolean> = (route, state) => {
    const fluxoService = inject(FluxoService);
    fluxoService.openForm(0);

    return true;
}