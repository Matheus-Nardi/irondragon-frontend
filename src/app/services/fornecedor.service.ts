import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { Fornecedor, IFornecedor } from '../models/fornecedor.model';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  findAll(): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(`${this.configService.getApiBaseUrl()}/fornecedores`);
  }

  findById(id: string): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(`${this.configService.getApiBaseUrl()}/fornecedores/${id}`);
  }

  create(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.post<Fornecedor>(`${this.configService.getApiBaseUrl()}/fornecedores`, fornecedor);
  }

  update(fornecedor: Fornecedor): Observable<any> {
    return this.httpClient.put<Fornecedor>(`${this.configService.getApiBaseUrl()}/fornecedores/${fornecedor.id}`, fornecedor);
  }

  delete(fornecedor: Fornecedor): Observable<any> {
    return this.httpClient.delete<Fornecedor>(`${this.configService.getApiBaseUrl()}/fornecedores/${fornecedor.id}`);
  }
}
