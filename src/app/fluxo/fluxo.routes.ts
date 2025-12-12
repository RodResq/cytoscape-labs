import { Routes } from '@angular/router';

export const FLUXO_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./fluxo.component').then(c => c.FluxoComponent),
        children: [
            {
                path: 'fluxo',
                loadComponent: () => import('./fluxo-form/fluxo-form.component').then(c => c.FluxoFormComponent)
      
            },
            { 
                path: 'node', 
                loadComponent: () =>  import('./node-form/node-form.component').then(c => c.NodeFormComponent)
            },
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
