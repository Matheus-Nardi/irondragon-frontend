import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { Fabricante } from '../models/fabricante.model';
import { PageResponse } from '../interfaces/pageresponse';

@Injectable({
  providedIn: 'root'
})
export class FabricanteService {
  constructor(private httpClient: HttpClient, private configService: ConfigService) {}

   findAll(page?:number, pageSize?:number): Observable<PageResponse<Fabricante>> {
      let params = {};
  
      if (page !== undefined && pageSize !== undefined) {
        params = {
          page: page.toString(),
          page_size: pageSize.toString()
        }
      }
  
      return this.httpClient.get<PageResponse<Fabricante>>(`${this.configService.getApiBaseUrl()}/fabricantes`, {params});
    }

     findByNome(nome:string, page?:number, pageSize?:number): Observable<PageResponse<Fabricante>> {
        let params = {};
    
        if (page !== undefined && pageSize !== undefined && nome !== undefined) {
          params = {  
            page: page.toString(),
            page_size: pageSize.toString()
          }
        }
        return this.httpClient.get<PageResponse<Fabricante>>(`${this.configService.getApiBaseUrl()}/fabricantes/search/${nome}`, {params});
      }
    
  create(fabricante: Fabricante): Observable<Fabricante> {
    const telefone ={
      codigoArea: fabricante.telefone.codigoArea,
      numero: fabricante.telefone.numero,
    }
    const data = {
      nome: fabricante.nome,
      email: fabricante.email,
      telefone: telefone,
    }
    return this.httpClient.post<Fabricante>(`${this.configService.getApiBaseUrl()}/fabricantes`, data);
  }

  delete(fabricante: Fabricante): Observable<void> {
    return this.httpClient.delete<void>(`${this.configService.getApiBaseUrl()}/fabricantes/${fabricante.id}`);
  }

  findById(id: string): Observable<Fabricante> {
    return this.httpClient.get<Fabricante>(`${this.configService.getApiBaseUrl()}/fabricantes/${id}`);
  }

  update(fabricante: Fabricante): Observable<any> {
    const telefone = {
      codigoArea: fabricante.telefone.codigoArea,
      numero: fabricante.telefone.numero,
    }
    const data = {
      nome: fabricante.nome,
      email: fabricante.email,
      telefone: telefone,
    }
    return this.httpClient.put<Fabricante>(`${this.configService.getApiBaseUrl()}/fabricantes/${fabricante.id}`, data);
  }
}
