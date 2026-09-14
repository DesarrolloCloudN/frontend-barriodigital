import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  CambiarEstadoTramiteDto,
  CrearTramiteDto,
  Tramite,
} from '../models/tramite.model';
import {
  ActualizarTipoTramiteDto,
  CrearTipoTramiteDto,
  TipoTramite,
} from '../models/tipo-tramite.model';

// Habla con el backend (BFF) para trámites y catálogo; agrega token vía interceptor.
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private readonly baseUrl = environment.azure.api.url;

  getMisTramites(): Observable<Tramite[]> {
    return this.http.get<Tramite[]>(`${this.baseUrl}/api/requests`);
  }

  // Mismo endpoint: el BFF resuelve "propios vs todos" según el rol del token.
  getTodosTramites(): Observable<Tramite[]> {
    return this.http.get<Tramite[]>(`${this.baseUrl}/api/requests`);
  }

  getTramite(id: number): Observable<Tramite> {
    return this.http.get<Tramite>(`${this.baseUrl}/api/requests/${id}`);
  }

  crearTramite(dto: CrearTramiteDto): Observable<Tramite> {
    return this.http.post<Tramite>(`${this.baseUrl}/api/requests`, dto);
  }

  cambiarEstadoTramite(
    id: number,
    dto: CambiarEstadoTramiteDto
  ): Observable<Tramite> {
    return this.http.put<Tramite>(
      `${this.baseUrl}/api/requests/${id}/estado`,
      dto
    );
  }

  getCatalogo(): Observable<TipoTramite[]> {
    return this.http.get<TipoTramite[]>(`${this.baseUrl}/api/catalog`);
  }

  crearTipoTramite(dto: CrearTipoTramiteDto): Observable<TipoTramite> {
    return this.http.post<TipoTramite>(`${this.baseUrl}/api/catalog`, dto);
  }

  actualizarTipoTramite(
    id: number,
    dto: ActualizarTipoTramiteDto
  ): Observable<TipoTramite> {
    return this.http.put<TipoTramite>(`${this.baseUrl}/api/catalog/${id}`, dto);
  }

  eliminarTipoTramite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/catalog/${id}`);
  }
}
