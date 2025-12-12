import { Routes } from '@angular/router';
import { FluxoComponent } from './fluxo/fluxo.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'fluxoApp',
        pathMatch: 'full'
        
    },
    {
        path: 'fluxoApp',
        component: FluxoComponent
    }
];
