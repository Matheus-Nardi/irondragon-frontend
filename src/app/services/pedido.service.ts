import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lote } from '../models/lote.model';
import { ConfigService } from './config.service';
import { Processador } from '../models/processador/processador.model';
import { Pedido } from '../models/pedido.model';
import { PageResponse } from '../interfaces/pageresponse.interface';

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
}
