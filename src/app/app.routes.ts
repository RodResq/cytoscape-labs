import { Routes } from '@angular/router';
import { FluxoFormComponent } from './fluxo/fluxo-form/fluxo-form.component';

export const routes: Routes = [
    {path: '', redirectTo: 'cadastrar/fluxo', pathMatch: 'full'},
    {path: 'cadastrar/fluxo', component: FluxoFormComponent}
];
