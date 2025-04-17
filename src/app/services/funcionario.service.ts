import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../interfaces/pageresponse.interface';
import { ConfigService } from './config.service';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  findAll(
    page?: number,
    pageSize?: number
  ): Observable<PageResponse<Funcionario>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString(),
      };
    }

    return this.httpClient.get<PageResponse<Funcionario>>(
      `${this.configService.getApiBaseUrl()}/funcionarios`,
      { params }
    );
  }

  delete(funcionario: Funcionario): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.configService.getApiBaseUrl()}/funcionarios/${funcionario.id}`
    );
  }

  findById(id: string): Observable<Funcionario> {
    return this.httpClient.get<Funcionario>(
      `${this.configService.getApiBaseUrl()}/funcionarios/${id}`
    );
  }

  create(usuarioId: Number, funcionario: Funcionario): Observable<Funcionario> {
      const data = {
        cargo: funcionario.cargo,
        salario: funcionario.salario,
        dataContratacao: funcionario.dataContratacao,
      }
      return this.httpClient.post<Funcionario>(`${this.configService.getApiBaseUrl()}funcionarios/${usuarioId}`, data);
    }

    update(funcionario: Funcionario): Observable<any> {

      const data = {
        cargo: funcionario.cargo,
        salario: funcionario.salario,
        dataContratacao: funcionario.dataContratacao,
      }
      console.log(data);
      
      return this.httpClient.put<Funcionario>(`${this.configService.getApiBaseUrl()}funcionarios/${funcionario.id}`, data);
    }
}
