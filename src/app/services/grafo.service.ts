import { computed, Injectable, signal } from '@angular/core';
import cytoscape from 'cytoscape';



export interface GrafoFormData {
  length: number,
  node: cytoscape.NodeSingular,
  form: Object,
  collection: cytoscape.NodeCollection
}

@Injectable({
  providedIn: 'root'
})
export class GrafoService {

  private grafoSignal = signal<GrafoFormData | null>(null);

  getGrafo = computed(() => this.grafoSignal());

  setGrafo(grafo: GrafoFormData) {
    console.log('Setando Grafo no Signal: ', grafo);
    this.grafoSignal.set(grafo);
  }



}
