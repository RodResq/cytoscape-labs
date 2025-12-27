import { Routes } from '@angular/router';
import { fluxoFormResolver } from './fluxo-form/fluxo-form.resolver';

export const FLUXO_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./fluxo.component').then(c => c.FluxoComponent),
        children: [
            {
                path: 'fluxo',
                loadComponent: () => import('./fluxo-form/fluxo-form.component').then(c => c.FluxoFormComponent),
                resolve: { form: fluxoFormResolver }

            },
            {
                path: 'node',
                loadComponent: () =>  import('./node-form/node-form.component').then(c => c.NodeFormComponent),
                resolve: { form: fluxoFormResolver }
            },
            // CRIAR ROTAS DE EDICAO
            {
                path: 'event',
                loadComponent: () => import('./event-form/event-form.component').then(c => c.EventFormComponent)
            },
            {
                path: 'build-xml',
                loadComponent: () => import('./build-xml/build-xml.component').then(c => c.BuildXmlComponent)
            }
        ]
    }
]
