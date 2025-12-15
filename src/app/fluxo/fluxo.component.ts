import { Component, effect, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from "@angular/router";
import { FluxoService } from './fluxo-form/fluxo.service';


@Component({
  selector: 'app-fluxo',
  imports: [
    RouterModule,
    CardModule,
    ButtonModule,
    RouterOutlet,
    CommonModule
],
  templateUrl: './fluxo.component.html',
  styleUrl: './fluxo.component.css'
})
export class FluxoComponent {
  public fluxoService = inject(FluxoService);

  public fluxoForm = this.fluxoService.form;

  constructor() {
    effect(() => {
      console.log('Valor do fluxoForm: ', this.fluxoForm);
      console.log('Visibility? ', this.fluxoForm().visible);
    });
  }

}
