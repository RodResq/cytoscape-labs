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
        loadChildren: () => import('./fluxo/fluxo.routes').then(m => m.FLUXO_ROUTES)
    }
];
