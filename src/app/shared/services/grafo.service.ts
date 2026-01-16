import { computed, Injectable, signal } from '@angular/core';
import { GrafoFormData } from '@shared/types/graph.types';


@Injectable({
  providedIn: 'root'
})
export class GrafoService {

  private grafoSignal = signal<GrafoFormData | null>(null);

  getGrafo = computed(() => this.grafoSignal());

  setGrafo(grafo: GrafoFormData) {
    this.grafoSignal.set(grafo);
  }



}
