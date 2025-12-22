import { Component, effect, inject, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from "@angular/router";
import { Acao, FluxoService } from './fluxo-form/fluxo.service';
import { FormsDataService } from '../shared/services/forms-data.service';


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
export class FluxoComponent implements OnInit{
  public fluxoService = inject(FluxoService);
  public formsDataService = inject(FormsDataService);

  public fluxoForm!: Acao;

  constructor() { }

  ngOnInit(): void {
    this.fluxoForm = this.fluxoService.form();
  }

  back() {
    console.log('Onclick back');
    
  }

  next() {
    console.log('OnCLick next: ', localStorage.getItem('step1'));
    
  }
  

}
