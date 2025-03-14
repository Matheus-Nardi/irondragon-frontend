import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '../models/estado.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  findAll(): Observable<Estado[]> {
    return this.httpClient.get<Estado[]>(`${this.configService.getApiBaseUrl()}/estados`);
  }

  findById(id: string): Observable<Estado> {
    return this.httpClient.get<Estado>(`${this.configService.getApiBaseUrl()}/estados/${id}`);
  }

  delete(estado: Estado): Observable<any> {
    return this.httpClient.delete(`${this.configService.getApiBaseUrl()}/estados/${estado.id}`);
  }

  create(estado: Estado): Observable<Estado> {
    return this.httpClient.post<Estado>(`${this.configService.getApiBaseUrl()}/estados` , estado);
  }

  update(estado: Estado): Observable<Estado> {
    return this.httpClient.put<Estado>(`${this.configService.getApiBaseUrl()}/estados/${estado.id}`, estado);
  }
  
}
