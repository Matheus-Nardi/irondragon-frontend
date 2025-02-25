import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '../models/estado.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  constructor(private httpClient: HttpClient, private configService: ConfigService) { }

  getEstados(): Observable<Estado[]> {
    return this.httpClient.get<Estado[]>(`${this.configService.getApiBaseUrl()}/estados`);
  }
}
