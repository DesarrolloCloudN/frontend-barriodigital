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

// Este servicio se encarga de hablar con el backend (el BFF) para pedir y guardar tanto los
// trámites como el catálogo de tipos de trámite. El interceptor de MSAL le agrega el token
// automáticamente a cada petición.
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private readonly baseUrl = environment.azure.api.url;

  // --- Trámites (ms-barriodigital-requests, vía BFF) ---

  // Pide al backend los trámites del vecino que inició sesión.
  getMisTramites(): Observable<Tramite[]> {
    return this.http.get<Tramite[]>(`${this.baseUrl}/api/requests`);
  }

  getTodosTramites(): Observable<Tramite[]> {
    // El filtro "propios vs todos" lo resuelve el BFF según el rol del token.
    return this.http.get<Tramite[]>(`${this.baseUrl}/api/requests`);
  }

  // Pide al backend un trámite específico por su id.
  getTramite(id: number): Observable<Tramite> {
    return this.http.get<Tramite>(`${this.baseUrl}/api/requests/${id}`);
  }

  // Crea un nuevo trámite en el backend.
  crearTramite(dto: CrearTramiteDto): Observable<Tramite> {
    return this.http.post<Tramite>(`${this.baseUrl}/api/requests`, dto);
  }

  // Cambia el estado de un trámite (por ejemplo de INGRESADO a ADMITIDO).
  cambiarEstadoTramite(
    id: number,
    dto: CambiarEstadoTramiteDto
  ): Observable<Tramite> {
    return this.http.put<Tramite>(
      `${this.baseUrl}/api/requests/${id}/estado`,
      dto
    );
  }

  // --- Catálogo (ms-barriodigital-catalog, vía BFF) ---

  // Pide al backend la lista completa de tipos de trámite disponibles.
  getCatalogo(): Observable<TipoTramite[]> {
    return this.http.get<TipoTramite[]>(`${this.baseUrl}/api/catalog`);
  }

  // Crea un nuevo tipo de trámite (solo lo puede hacer un Admin).
  crearTipoTramite(dto: CrearTipoTramiteDto): Observable<TipoTramite> {
    return this.http.post<TipoTramite>(`${this.baseUrl}/api/catalog`, dto);
  }

  // Actualiza los datos de un tipo de trámite existente.
  actualizarTipoTramite(
    id: number,
    dto: ActualizarTipoTramiteDto
  ): Observable<TipoTramite> {
    return this.http.put<TipoTramite>(`${this.baseUrl}/api/catalog/${id}`, dto);
  }

  // Elimina un tipo de trámite del catálogo.
  eliminarTipoTramite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/catalog/${id}`);
  }
}
