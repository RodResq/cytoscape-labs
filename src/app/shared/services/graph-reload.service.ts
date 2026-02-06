import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GraphReloadService {
  private reloadSubject = new Subject<void>();
  private xmlSubject = new Subject<string>();

  reload$ = this.reloadSubject.asObservable();
  xmlLoad$ = this.xmlSubject.asObservable();

  triggerReload() {
    this.reloadSubject.next();
  }

  triggerXmlLoad(xmlString: string) {
    this.xmlSubject.next(xmlString);
  }
}
