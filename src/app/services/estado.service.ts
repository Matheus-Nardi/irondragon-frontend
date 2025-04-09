import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '../models/estado.model';
import { ConfigService } from './config.service';
import { PageResponse } from '../interfaces/pageresponse.interface';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  findAll(page?:number, pageSize?:number): Observable<PageResponse<Estado>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      }
    }

    return this.httpClient.get<PageResponse<Estado>>(`${this.configService.getApiBaseUrl()}/estados`, {params});
  }

  findByNome(nome:string, page?:number, pageSize?:number): Observable<PageResponse<Estado>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined && nome !== undefined) {
      params = {  
        page: page.toString(),
        page_size: pageSize.toString()
      }
    }
    return this.httpClient.get<PageResponse<Estado>>(`${this.configService.getApiBaseUrl()}/estados/search/${nome}`, {params});
  }

  delete(estado: Estado): Observable<any> {
    return this.httpClient.delete(`${this.configService.getApiBaseUrl()}/estados/${estado.id}`);
  }

  create(estado: Estado): Observable<Estado> {
    return this.httpClient.post<Estado>(`${this.configService.getApiBaseUrl()}/estados` , estado);
  }

  findById(id: string): Observable<Estado> {
    return this.httpClient.get<Estado>(`${this.configService.getApiBaseUrl()}/estados/${id}`);
  }

  update(estado: Estado): Observable<any> {
    return this.httpClient.put<Estado>(`${this.configService.getApiBaseUrl()}/estados/${estado.id}`, estado);
  }
  
}
