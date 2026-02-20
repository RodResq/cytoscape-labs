import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GraphReloadService {
  private reloadSubject = new Subject<void>();
  private xmlSubject = new Subject<string>();
  private clearSubject = new Subject<void>();


  reload$ = this.reloadSubject.asObservable();
  xmlLoad$ = this.xmlSubject.asObservable();
  clear$ = this.clearSubject.asObservable();

  triggerReload() {
    this.reloadSubject.next();
  }

  triggerXmlLoad(xmlString: string) {
    this.xmlSubject.next(xmlString);
  }

  triggerClear() {
    this.clearSubject.next();
  }
}
