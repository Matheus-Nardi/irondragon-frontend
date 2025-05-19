import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../interfaces/pageresponse.interface';
import { Fabricante } from '../models/fabricante.model';
import { ConfigService } from './config.service';
import { Endereco } from '../models/endereco/endereco.model';
import { Cidade } from '../models/cidade.model';

@Injectable({
  providedIn: 'root',
})
export class EnderecoService {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  update(endereco: Endereco): Observable<any> {
    const data = {
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      cep: endereco.cep,
      complemento: endereco.complemento,
      idCidade: endereco.cidade.id,
      numero: endereco.numero,
    };
    return this.httpClient.put<Endereco>(
      `${this.configService.getApiBaseUrl()}/enderecos/${endereco.id}`,
      data
    );
  }

  create(endereco: Endereco): Observable<Endereco> {
    const data = {
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      cep: endereco.cep,
      complemento: endereco.complemento,
      idCidade: endereco.cidade.id,
      numero: endereco.numero,
    };
    return this.httpClient.post<Endereco>(
      `${this.configService.getApiBaseUrl()}/enderecos`,
      data
    );
  }

  getByUsuario(): Observable<Endereco[]> {
    return this.httpClient.get<Endereco[]>(
      `${this.configService.getApiBaseUrl()}/enderecos/usuarios`
    );
  }

  delete(endereco: Endereco): Observable<any> {
    return this.httpClient.delete(`${this.configService.getApiBaseUrl()}/enderecos/${endereco.id}`);
  }
}
