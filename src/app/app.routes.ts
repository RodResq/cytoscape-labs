import { Routes } from '@angular/router';

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
