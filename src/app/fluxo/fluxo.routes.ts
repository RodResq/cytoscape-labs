import { Routes } from '@angular/router';
import { FluxoComponent } from './fluxo.component';
import { FluxoFormComponent } from './fluxo-form/fluxo-form.component';
import { NodeFormComponent } from './node-form/node-form.component';
import { EventFormComponent } from './event-form/event-form.component';
import { BuildXmlComponent } from './build-xml/build-xml.component';

export const FLUXO_ROUTES: Routes = [
    {
        path: '',
        component: FluxoComponent,
        children: [
            {
                path: 'fluxo',
                loadComponent: () => import('./fluxo-form/fluxo-form.component').then(c => c.FluxoFormComponent)
      
            },
            { path: 'node', loadComponent: () =>  import('./node-form/node-form.component').then(
                (c) => (c.NodeFormComponent)
            )},
            { path: 'event', loadComponent: () => import('./event-form/event-form.component').then(
                (c) => c.EventFormComponent
            ) },
            { path: 'build-xml', loadComponent: () => import('./build-xml/build-xml.component').then(
                (c) => c.BuildXmlComponent
            )}
        ]
    }
]
