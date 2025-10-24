import { Routes } from '@angular/router';
import { FluxoComponent } from './fluxo.component';
import { FluxoFormComponent } from './fluxo-form/fluxo-form.component';
import { NodeFormComponent } from './node-form/node-form.component';

export const FLUXO_ROUTES: Routes = [
    { 
        path: '', 
        component: FluxoComponent,
        children: [
            { path: '', redirectTo: 'fluxo', pathMatch: 'full'},
            { path: 'fluxo', component: FluxoFormComponent },
            { path: 'node', component: NodeFormComponent }
        ]
    }
]