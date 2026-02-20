import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GraphReloadService } from './graph-reload.service';
import { XMLImporterService } from './xml-importer.service';


export interface ImportResult {
  success: boolean,
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class GraphImporterService {
  private xmlImporterService = inject(XMLImporterService)
  private graphReloadService = inject(GraphReloadService);
  
  async importXmlAndCreateGraph(xmlString: string): Promise<ImportResult> {
    try {
      const { nodes, edges } = this.xmlImporterService.importFromXml(xmlString);

      if (nodes.length === 0) {
        throw new Error('Nenhum nó foi encontrado no XML');
      }


      localStorage.setItem('importedGraph', JSON.stringify({ nodes, edges }));
      this.graphReloadService.triggerReload();

      return { success: false, message: JSON.stringify({ nodes, edges })}

    } catch (error) {
      console.error('Erro ao importar XML: ', error);
      return { success: false, message: 'Erro ao processar arquivo XML.'}
    }
  }
}
