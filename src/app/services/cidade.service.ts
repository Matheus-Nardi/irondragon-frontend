import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable, ObservedValueOf } from 'rxjs';
import { Cidade } from '../models/cidade.model';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  constructor(private readonly httpClient: HttpClient, private readonly configService: ConfigService) { }

  findAll(): Observable<Cidade[]> {
    return this.httpClient.get<Cidade[]>(`${this.configService.getApiBaseUrl()}/cidades`);
  }

  create(cidade: Cidade): Observable<Cidade> {
    const novaCidade = {
      nome: cidade.nome,
      estado: cidade.estado.id
    }

    return this.httpClient.post<Cidade>(`${this.configService.getApiBaseUrl()}/cidades`, novaCidade);
  }

  delete(cidade: Cidade): Observable<any> {
    return this.httpClient.delete<Cidade>(`${this.configService.getApiBaseUrl()}/cidades/${cidade.id}`);
  }
}
