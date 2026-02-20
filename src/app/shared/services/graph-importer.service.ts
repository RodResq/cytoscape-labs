import { inject, Injectable } from '@angular/core';
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
      localStorage.removeItem('importedGraph');
      this.graphReloadService.triggerClear();

      await new Promise(resolve => setTimeout(resolve, 50));

      localStorage.setItem('importedGraph', JSON.stringify({ nodes, edges }));
      this.graphReloadService.triggerReload();

      return { success: true, message: 'XML importado com sucesso!'}

    } catch (error) {
      console.error('Erro ao importar XML: ', error);
      return { success: false, message: 'Erro ao processar arquivo XML.'}
    }
  }
}
