import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { Cidade } from '../models/cidade.model';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  constructor(private readonly httpClient: HttpClient, private readonly configService: ConfigService) { }

  getCidades(): Observable<Cidade[]> {
    return this.httpClient.get<Cidade[]>(`${this.configService.getApiBaseUrl()}/cidades`);
  }
}
