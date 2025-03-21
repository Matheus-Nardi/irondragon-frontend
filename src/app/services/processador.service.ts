import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Processador } from '../models/processador/processador.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessadorService {
 constructor(private readonly httpClient: HttpClient, private readonly configService: ConfigService) { }
  
    findById(id: string): Observable<Processador> {
      return this.httpClient.get<Processador>(`${this.configService.getApiBaseUrl()}/processadores/${id}`);
    }
  
    findAll(): Observable<Processador[]> {
      return this.httpClient.get<Processador[]>(`${this.configService.getApiBaseUrl()}/processadores`);
    }
  
}
