import { computed, Injectable, signal } from '@angular/core';
import { GrafoFormData } from '@shared/types/graph.types';
import * as cytoscape from 'cytoscape';


@Injectable({
  providedIn: 'root'
})
export class GrafoService {

  private grafoSignal = signal<GrafoFormData | null>(null);
  private nodeSignal = signal<cytoscape.NodeSingular | null>(null);

  getGrafo = computed(() => this.grafoSignal());
  getNode = computed(() => this.nodeSignal());

  setGrafo(grafo: GrafoFormData) {
    this.grafoSignal.set(grafo);
  }

  editNode(node: cytoscape.NodeSingular) {
    this.nodeSignal.set(node);
  }

}
