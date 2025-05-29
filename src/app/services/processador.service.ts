import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Processador } from '../models/processador/processador.model';
import { ConfigService } from './config.service';
import { PageResponse } from '../interfaces/pageresponse.interface';
import { ProcessadorFiltroResponse } from '../interfaces/processador-filtro-response';


type Filtro = {
  fabricante: string;
  precoMin: number;
  precoMax: number;
  sockets: string[];
  graficosIntegrados: string;
  sortBy: string;
}

@Injectable({
  providedIn: 'root'
})


export class ProcessadorService {
  constructor(private readonly httpClient: HttpClient, private readonly configService: ConfigService) { }

  findById(id: string): Observable<Processador> {
    return this.httpClient.get<Processador>(`${this.configService.getApiBaseUrl()}/processadores/${id}`);
  }

  findAll(page?:number, pageSize?:number): Observable<PageResponse<Processador>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      }
    }

    return this.httpClient.get<PageResponse<Processador>>(`${this.configService.getApiBaseUrl()}/processadores`, {params});
  }


  findByFiltros(page?: number, pageSize?: number, filtro?: Filtro): Observable<PageResponse<Processador>> {
  let params: any = {};

  // Paginação
  if (page !== undefined) {
    params.page = page.toString();
  }
  if (pageSize !== undefined) {
    params.page_size = pageSize.toString();
  }

  // Filtros (se existirem)
  if (filtro) {
    if (filtro.fabricante) {
      params.fabricante = filtro.fabricante;
    }
    if (filtro.precoMin !== undefined) {
      params.precoMin = filtro.precoMin.toString();
    }
    if (filtro.precoMax !== undefined) {
      params.precoMax = filtro.precoMax.toString();
    }
    if (filtro.sockets && filtro.sockets.length > 0) {
      // Lista convertida para múltiplos parâmetros: ?sockets=AM4&sockets=LGA1200
      filtro.sockets.forEach((s, index) => {
        params[`sockets[${index}]`] = s;
      });
    }
    if (filtro.graficosIntegrados) {
      params.graficosIntegrados = filtro.graficosIntegrados;
    }
    if (filtro.sortBy) {
      params.sortBy = filtro.sortBy;
    }
  }

  return this.httpClient.get<PageResponse<Processador>>(
    `${this.configService.getApiBaseUrl()}/processadores/filtros`,
    { params }
  );
}


  findByNome(nome: string, page?:number, pageSize?:number): Observable<PageResponse<Processador>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      }
    }

    return this.httpClient.get<PageResponse<Processador>>(`${this.configService.getApiBaseUrl()}/processadores/${nome}`, {params});
  }

  delete(processador: Processador): Observable<any> {
    return this.httpClient.delete<Processador>(`${this.configService.getApiBaseUrl()}/processadores/${processador.id}`);
  }

  create(processador: Processador): Observable<Processador> {
    const data = {
      nome: processador.nome,
      socket: processador.socket,
      threads: processador.threads,
      nucleos: processador.nucleos,
      desbloqueado: processador.desbloqueado,
      preco: Number(processador.preco),
      placaIntegrada: processador.placaIntegrada?.id || null,
      fabricante: processador.fabricante.id,
      memoriaCache: {
        cacheL2: Number(processador.memoriaCache.cacheL2),
        cacheL3: Number(processador.memoriaCache.cacheL3)
      },
      frequencia: processador.frequencia,
      consumoEnergetico: processador.consumoEnergetico,
      conectividade: processador.conectividade
    }

    console.log(JSON.stringify(data));


    return this.httpClient.post<Processador>(`${this.configService.getApiBaseUrl()}/processadores`, data);
  }

  update(processador: Processador): Observable<any> {
    const data = {
      nome: processador.nome,
      socket: processador.socket,
      threads: processador.threads,
      nucleos: processador.nucleos,
      desbloqueado: processador.desbloqueado,
      preco: Number(processador.preco),
      placaIntegrada: processador.placaIntegrada?.id || null,
      fabricante: processador.fabricante.id,
      memoriaCache: {
        cacheL2: Number(processador.memoriaCache.cacheL2),
        cacheL3: Number(processador.memoriaCache.cacheL3)
      },
      frequencia: processador.frequencia,
      consumoEnergetico: processador.consumoEnergetico,
      conectividade: processador.conectividade
    }

    return this.httpClient.put<Processador>(`${this.configService.getApiBaseUrl()}/processadores/${processador.id}`, data);
  }



  getUrlImage(id:string, nomeImagem: string): string{
    return `${this.configService.getApiBaseUrl()}/processadores/${id}/download/imagem/${nomeImagem}`
  }


  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);
    
    return this.httpClient.patch<Processador>(`${this.configService.getApiBaseUrl()}/processadores/${id}/upload/imagem`, formData);
  }

    getFiltrosValue(): Observable<ProcessadorFiltroResponse> {
    return this.httpClient.get<ProcessadorFiltroResponse>(`${this.configService.getApiBaseUrl()}/processadores/filtros`);
  }
}
