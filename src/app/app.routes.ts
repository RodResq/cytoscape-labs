import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'fluxoApp',
        pathMatch: 'full'
    },
    {
        path: 'fluxoApp', 
        loadChildren: () => import('./fluxo/fluxo.routes')
            .then(c => c.FLUXO_ROUTES)
    },
];
