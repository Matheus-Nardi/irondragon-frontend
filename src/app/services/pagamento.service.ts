import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';


@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  constructor(
    private readonly httpClient: HttpClient, 
    private readonly configService: ConfigService
  ) { }

  
  boletoPayment(idBoleto: number, idPedido:number): Observable<any>{
    
    return this.httpClient.patch<Pedido>(`${this.configService.getApiBaseUrl()}/pagamentos/${idPedido}/boleto/${idBoleto}`, null);
  }

   pixPayment(idPix: number, idPedido:number): Observable<any>{
    
    return this.httpClient.patch<Pedido>(`${this.configService.getApiBaseUrl()}/pagamentos/${idPedido}/pix/${idPix}`, null);
  }
}
