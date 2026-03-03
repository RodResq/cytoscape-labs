import { computed, Injectable, signal } from '@angular/core';
import { GrafoFormData } from '@shared/types/graph.types';


@Injectable({
  providedIn: 'root'
})
export class GrafoService {

  private grafoSignal = signal<GrafoFormData | null>(null);
  private nodeSignal = signal<Node | null>(null);

  getGrafo = computed(() => this.grafoSignal());
  getNode = computed(() => this.nodeSignal());

  setGrafo(grafo: GrafoFormData) {
    this.grafoSignal.set(grafo);
  }

  editNode(node: Node) {
    this.nodeSignal.set(node);
  }

}
