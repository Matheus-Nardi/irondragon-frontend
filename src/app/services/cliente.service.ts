import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Processador } from '../models/processador/processador.model';
import { ConfigService } from './config.service';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

   findByUsername(username: string): Observable<Cliente> {
      return this.httpClient.get<Cliente>(`${this.configService.getApiBaseUrl()}clientes/search/${username}`)
     }

  getListaDesejos(): Observable<Processador[]> {
    return this.httpClient.get<Processador[]>(
      `${this.configService.getApiBaseUrl()}clientes/search/desejos`
    );
  }

 addToListaDeDesejos(idProcessador: number): Observable<any> {
  return this.httpClient.post<any>(
    `${this.configService.getApiBaseUrl()}clientes/desejos/${idProcessador}`,
    null 
  );
}

removeFromListaDeDesejos(id: number): Observable<any> {
  return this.httpClient.delete(
    `${this.configService.getApiBaseUrl()}clientes/desejos/${id}`
  );
}


}
