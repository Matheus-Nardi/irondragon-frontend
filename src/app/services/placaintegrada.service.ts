import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PlacaIntegrada} from '../models/processador/placaintegrada.model';
import {ConfigService} from './config.service';
import { PageResponse } from '../interfaces/pageresponse.interface';

@Injectable({
  providedIn: 'root'
})
export class PlacaintegradaService {

  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  findAll(page?:number, pageSize?:number): Observable<PageResponse<PlacaIntegrada>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      }
    }
    return this.httpClient.get<PageResponse<PlacaIntegrada>>(`${this.configService.getApiBaseUrl()}/placasintegradas`, {params});
  }

  findByNome(nome:string, page?:number, pageSize?:number): Observable<PageResponse<PlacaIntegrada>> {
        let params = {};
    
        if (page !== undefined && pageSize !== undefined && nome !== undefined) {
          params = {  
            page: page.toString(),
            page_size: pageSize.toString()
          }
        }
        return this.httpClient.get<PageResponse<PlacaIntegrada>>(`${this.configService.getApiBaseUrl()}/placasintegradas/search/${nome}`, {params});
      }

  findById(id: string): Observable<PlacaIntegrada> {
    return this.httpClient.get<PlacaIntegrada>(`${this.configService.getApiBaseUrl()}/placasintegradas/${id}`);
  }

  create(placaIntegrada: PlacaIntegrada): Observable<PlacaIntegrada> {
    return this.httpClient.post<PlacaIntegrada>(`${this.configService.getApiBaseUrl()}/placasintegradas`, placaIntegrada);
  }

  update(placaIntegrada: PlacaIntegrada): Observable<any> {
    return this.httpClient.put<PlacaIntegrada>(`${this.configService.getApiBaseUrl()}/placasintegradas/${placaIntegrada.id}`, placaIntegrada);
  }

  delete(placaIntegrada: PlacaIntegrada): Observable<any> {
    return this.httpClient.delete<PlacaIntegrada>(`${this.configService.getApiBaseUrl()}/placasintegradas/${placaIntegrada.id}`);
  }
}
