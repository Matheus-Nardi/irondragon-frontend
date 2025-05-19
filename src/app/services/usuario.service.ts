import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../interfaces/pageresponse.interface';
import { Funcionario } from '../models/funcionario.model';
import { ConfigService } from './config.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  findByUsername(username: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(
      `${this.configService.getApiBaseUrl()}usuarios/search/${username}`
    );
  }

  findByCpf(cpf: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(
      `${this.configService.getApiBaseUrl()}usuarios/search/cpf/${cpf}`
    );
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(
      `${this.configService.getApiBaseUrl()}usuarios`,
      usuario
    );
  }

  getPerfil(): Observable<Usuario> {
    return this.httpClient.get<Usuario>(
      `${this.configService.getApiBaseUrl()}usuarios/meu-perfil`
    );
  }

  updateInfoBasica(usuarioUpdateBasico: any): Observable<any> {
    return this.httpClient.patch<Usuario>(
      `${this.configService.getApiBaseUrl()}usuarios/info-basica`,
      usuarioUpdateBasico
    );
  }

   getUrlImage(id:string, nomeImagem: string): string{
      return `${this.configService.getApiBaseUrl()}/usuarios/${id}/download/imagem/${nomeImagem}`
    }
  
  
    uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('id', id.toString());
      formData.append('nomeImagem', imagem.name);
      formData.append('imagem', imagem, imagem.name);
      
      return this.httpClient.patch<Usuario>(`${this.configService.getApiBaseUrl()}/usuarios/${id}/upload/imagem`, formData);
    }
}
