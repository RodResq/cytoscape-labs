import { computed, Injectable, signal } from '@angular/core';
import { XmlNodeRepresentation } from 'src/app/graph/node-xml-mapping';


@Injectable({
  providedIn: 'root'
})
export class FormService  {
  private formSignal = signal<any>(null);

  public form = this.formSignal.asReadonly();

  setForm(nodeFormValue: any) {
    // Clonar o objeto garante que a referência mude e o signal dispare todos os subscribers
    this.formSignal.set(nodeFormValue ? { ...nodeFormValue } : null);
  }

}
