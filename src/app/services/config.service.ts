import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private baseUrl: string = "http://localhost:8080/";

  constructor() { }

  getApiBaseUrl(): string {
    return this.baseUrl;
  }
}
