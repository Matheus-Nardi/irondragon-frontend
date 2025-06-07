import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Processador } from '../models/processador/processador.model';
import { Pedido } from '../models/pedido.model';
import { PageResponse } from '../interfaces/pageresponse.interface';
import { StatusPedido } from '../models/status-pedido.model';
import { PedidoPagamento } from '../models/pedido-pagamento';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private readonly httpClient: HttpClient, private readonly configService: ConfigService) { }

 findProcessadoresMaisPedidos() : Observable<Processador[]>{
         return this.httpClient.get<Processador[]>(`${this.configService.getApiBaseUrl()}/pedido-adm/mais-vendidos`);
     }

  
  getByUsername(page?:number, pageSize?:number): Observable<PageResponse<Pedido>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      }
    }
     return this.httpClient.get<PageResponse<Pedido>>(`${this.configService.getApiBaseUrl()}/pedidos/lista`, params);
  }


  findById(id: string): Observable<Pedido> {
      return this.httpClient.get<Pedido>(`${this.configService.getApiBaseUrl()}/pedidos/${id}`);
    }

  cancel(id: number): Observable<any> {
    return this.httpClient.patch<Pedido>(`${this.configService.getApiBaseUrl()}/pedidos/cancelar/${id}`, null)
  }

   findAll(page?:number, pageSize?:number): Observable<PageResponse<Pedido>> {
      let params = {};
  
      if (page !== undefined && pageSize !== undefined) {
        params = {
          page: page.toString(),
          page_size: pageSize.toString()
        }
      }
  
      return this.httpClient.get<PageResponse<Pedido>>(`${this.configService.getApiBaseUrl()}/pedidos`, {params});
    }


   changeStatus(id: number, status: StatusPedido): Observable<any> {
  return this.httpClient.patch<Pedido>(
    `${this.configService.getApiBaseUrl()}/pedido-adm/${id}?status=${status.label.toUpperCase()}`,
    null 
  );
}
  create(pedido: PedidoPagamento): Observable<any> {
    return this.httpClient.post<PedidoPagamento >(`${this.configService.getApiBaseUrl()}/pedidos`, pedido);
  }
}
