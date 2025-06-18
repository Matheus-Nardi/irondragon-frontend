import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cartao } from '../models/cartao.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {

   constructor(
      private httpClient: HttpClient,
      private configService: ConfigService
    ) {}
  
    update(cartao: Cartao): Observable<any> {
      const data = {
        nomeTitular: cartao.nomeTitular,
        numero: cartao.numero,
        cpf: cartao.cpf,
        validade: cartao.validade,
        cvc: cartao.cvc,
        tipoCartao: cartao.tipo
      };
      return this.httpClient.put<Cartao>(
        `${this.configService.getApiBaseUrl()}/cartoes/${cartao.id}`,
        data
      );
    }
  
    create(cartao: Cartao): Observable<Cartao> {
     const data = {
        nomeTitular: cartao.nomeTitular,
        numero: cartao.numero,
        cpf: cartao.cpf,
        validade: cartao.validade,
        cvc: cartao.cvc,
        tipoCartao: cartao.tipo
      };

      return this.httpClient.post<Cartao>(
        `${this.configService.getApiBaseUrl()}/cartoes`,
        data
      );
    }
  
    getByUsuario(): Observable<Cartao[]> {
      return this.httpClient.get<Cartao[]>(
        `${this.configService.getApiBaseUrl()}/cartoes/usuarios`
      );
    }
  
    delete(cartao: Cartao): Observable<any> {
      return this.httpClient.delete(`${this.configService.getApiBaseUrl()}/cartoes/${cartao.id}`);
    }
}
