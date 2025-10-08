import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ButtonsService {
  showFluxoFormSignal = signal<boolean>(true);
  showNodeFormSignal = signal<boolean>(false);
  showEventFormSignal = signal<boolean>(false);
  showBuildXmlSignal = signal<boolean>(false);

  getShowNodeForm = computed(() => this.showNodeFormSignal());
  getShowFluxoForm = computed(() => this.showFluxoFormSignal());
  getShowEventForm = computed(() => this.showEventFormSignal());
  getShowBuildXml = computed(() => this.showBuildXmlSignal());

  setShowFluxoForm() {
    this.showFluxoFormSignal.set(true);
    this.showNodeFormSignal.set(false);
    this.showEventFormSignal.set(false);
  }

  setShowNodeForm() {
    this.showNodeFormSignal.set(true);
    this.showFluxoFormSignal.set(false);
    this.showEventFormSignal.set(false);
  }

  setHiddenNodeForm() {
    this.showNodeFormSignal.set(false);
    this.showFluxoFormSignal.set(false);
    this.showEventFormSignal.set(false);
  }

  setShowEventForm() {
    this.showEventFormSignal.set(true);
    this.showNodeFormSignal.set(false);
    this.showFluxoFormSignal.set(false);
  }

  setShowBuildXml() {
    this.showEventFormSignal.set(false);
    this.showNodeFormSignal.set(false);
    this.showFluxoFormSignal.set(false);
    this.showBuildXmlSignal.set(true);
  }

}
