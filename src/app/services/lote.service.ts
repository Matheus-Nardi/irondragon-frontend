import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lote } from '../models/lote.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

    constructor(private readonly httpClient: HttpClient, private readonly configService: ConfigService) { }
  
    findById(id: string): Observable<Lote> {
      return this.httpClient.get<Lote>(`${this.configService.getApiBaseUrl()}/lotes/${id}`);
    }
  
    findAll(): Observable<Lote[]> {
      return this.httpClient.get<Lote[]>(`${this.configService.getApiBaseUrl()}/lotes`);
    }
  
    create(lote: Lote): Observable<Lote> {

      const data = {
        codigo: lote.codigo,
        estoque: lote.estoque,
        data: lote.data,
        idProcessador: lote.processador.id,
        idFornecedor: lote.fornecedor.id
      }
  
      return this.httpClient.post<Lote>(`${this.configService.getApiBaseUrl()}/lotes`, data);
    }
  
    update(lote: Lote): Observable<any> {
      const data = {
        codigo: lote.codigo,
        estoque: lote.estoque,
        data: lote.data,
        idProcessador: lote.processador.id,
        idFornecedor: lote.fornecedor.id
      }
  
      return this.httpClient.put<Lote>(`${this.configService.getApiBaseUrl()}/lotes/${lote.id}`, data);
    }
  
    delete(lote: Lote): Observable<any> {
      return this.httpClient.delete<Lote>(`${this.configService.getApiBaseUrl()}/lotes/${lote.id}`);
    }
}
