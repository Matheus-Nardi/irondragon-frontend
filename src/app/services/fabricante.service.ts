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

  getFabricantes(): Observable<Fabricante[]> {
    return this.httpClient.get<Fabricante[]>(`${this.configService.getApiBaseUrl()}/fabricantes`);
  }
}
