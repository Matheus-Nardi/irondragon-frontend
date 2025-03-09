import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { Fornecedor } from '../models/fornecedor.model';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  findAll(): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(`${this.configService.getApiBaseUrl()}/fornecedores`);
  }

  create(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.post<Fornecedor>(`${this.configService.getApiBaseUrl()}/fornecedores`, fornecedor);
  }
}
