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
            { path: '', redirectTo: 'fluxo', pathMatch: 'full' },
            { path: 'fluxo', component: FluxoFormComponent },
            { path: 'node', component: NodeFormComponent },
            { path: 'event', component: EventFormComponent },
            { path: 'build-xml', component: BuildXmlComponent }
        ]
    }
]
