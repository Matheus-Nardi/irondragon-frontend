import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../interfaces/pageresponse.interface';
import { Funcionario } from '../models/funcionario.model';
import { ConfigService } from './config.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

 constructor(
     private httpClient: HttpClient,
     private configService: ConfigService
   ) {}
 
   findByUsername(username: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.configService.getApiBaseUrl()}usuarios/search/${username}`)
   }

   findByCpf(cpf: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.configService.getApiBaseUrl()}usuarios/search/cpf/${cpf}`)
   }
}
