import { computed, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import cytoscape from 'cytoscape';



export interface GrafoFormData {
  length: number,
  node: cytoscape.NodeSingular,
  form: FormGroup | {} | null,
  collection: cytoscape.NodeCollection,
  visible: boolean
}

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
