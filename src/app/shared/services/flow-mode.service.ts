import { Injectable, signal } from '@angular/core';

export type FlowMode = 'xml-import' | 'manual' | null;

@Injectable({
  providedIn: 'root'
})
export class FlowModeService {
  private _mode = signal<FlowMode>(null);

  readonly mode = this._mode.asReadonly();

  setMode(mode: FlowMode): void {
    this._mode.set(mode);
  }

  getMode(): FlowMode {
    return this._mode();
  }
}
