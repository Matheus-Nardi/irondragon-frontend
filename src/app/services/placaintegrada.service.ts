import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PlacaIntegrada} from '../models/processador/placaintegrada.model';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PlacaintegradaService {

  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  findAll(): Observable<PlacaIntegrada[]> {
    return this.httpClient.get<PlacaIntegrada[]>(`${this.configService.getApiBaseUrl()}/placasintegradas`);
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
