import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { Fornecedor, IFornecedor } from '../models/fornecedor.model';
import { PageResponse } from '../interfaces/pageresponse.interface';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  findAll(page?: number, pageSize?: number): Observable<PageResponse<Fornecedor>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      }
    }

    return this.httpClient.get<PageResponse<Fornecedor>>(`${this.configService.getApiBaseUrl()}/fornecedores`, {params});
  }

    findByNome(nome:string, page?:number, pageSize?:number): Observable<PageResponse<Fornecedor>> {
      let params = {};
  
      if (page !== undefined && pageSize !== undefined && nome !== undefined) {
        params = {  
          page: page.toString(),
          page_size: pageSize.toString()
        }
      }
      return this.httpClient.get<PageResponse<Fornecedor>>(`${this.configService.getApiBaseUrl()}/fornecedores/search/${nome}`, {params});
    }
  

  findById(id: string): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(`${this.configService.getApiBaseUrl()}/fornecedores/${id}`);
  }

  create(fornecedor: Fornecedor): Observable<Fornecedor> {
    const telefone ={
      codigoArea: fornecedor.telefone.codigoArea,
      numero: fornecedor.telefone.numero,
    }
    const data = {
      nome: fornecedor.nome,
      email: fornecedor.email,
      telefone: telefone,
    }
    return this.httpClient.post<Fornecedor>(`${this.configService.getApiBaseUrl()}/fornecedores`, data);
  }

  update(fornecedor: Fornecedor): Observable<any> {
    const data = {
      nome: fornecedor.nome,
      email: fornecedor.email,
      telefone: {
        codigoArea: fornecedor.telefone.codigoArea,
        numero: fornecedor.telefone.numero,
      },
    }
    return this.httpClient.put<Fornecedor>(`${this.configService.getApiBaseUrl()}/fornecedores/${fornecedor.id}`, data);
  }

  delete(fornecedor: Fornecedor): Observable<any> {
    return this.httpClient.delete<Fornecedor>(`${this.configService.getApiBaseUrl()}/fornecedores/${fornecedor.id}`);
  }
}
