import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Processador } from '../models/processador/processador.model';
import { ConfigService } from './config.service';
import { PageResponse } from '../interfaces/pageresponse.interface';

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
    return this.httpClient.post<Processador>(`${this.configService.getApiBaseUrl()}/processadores`, processador);
  }

  update(processador: Processador): Observable<any> {
    return this.httpClient.put<Processador>(`${this.configService.getApiBaseUrl()}/processadores/${processador.id}`, processador);
  }
}
