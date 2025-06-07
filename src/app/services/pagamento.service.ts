import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  constructor(
    private readonly httpClient: HttpClient, 
    private readonly configService: ConfigService
  ) { }

  
  boletoPayment(idBoleto: number, idPedido:number): Observable<any>{

    return this.httpClient.patch<any>(`${this.configService.getApiBaseUrl()}/pagamentos/${idPedido}/boleto/${idBoleto}`, {});
  }

   pixPayment(idPix: number, idPedido:number): Observable<any>{
    return this.httpClient.patch<any>(`${this.configService.getApiBaseUrl()}/pagamentos/${idPedido}/pix/${idPix}`, {});
  }
}
