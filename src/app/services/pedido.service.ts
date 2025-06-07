import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lote } from '../models/lote.model';
import { ConfigService } from './config.service';
import { Processador } from '../models/processador/processador.model';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private readonly httpClient: HttpClient, private readonly configService: ConfigService) { }

  findProcessadoresMaisPedidos(): Observable<Processador[]> {
    return this.httpClient.get<Processador[]>(`${this.configService.getApiBaseUrl()}/pedido-adm/mais-vendidos`);
  }

  create(pedido: Pedido): Observable<Pedido> {
    return this.httpClient.post<Pedido>(`${this.configService.getApiBaseUrl()}/pedidos`, pedido);
  }
}
