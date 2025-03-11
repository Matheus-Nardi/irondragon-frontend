import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { Fabricante } from '../models/fabricante.model';

@Injectable({
  providedIn: 'root'
})
export class FabricanteService {
  constructor(private httpClient: HttpClient, private configService: ConfigService) {}

  findAll(): Observable<Fabricante[]> {
    return this.httpClient.get<Fabricante[]>(`${this.configService.getApiBaseUrl()}/fabricantes`);
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
}
