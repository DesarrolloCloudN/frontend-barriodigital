import { Component, computed, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import {
  EstadoTramite,
  TRANSICIONES_ESTADO,
  Tramite,
} from '../../models/tramite.model';

// Trámites: el vecino ve los suyos; Admin/Funcionario ve todos y cambia estados.
@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './requests.html',
  styleUrl: './requests.scss',
})
export class RequestsComponent {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  puedeGestionar = computed(() =>
    this.authService.roles().some((rol) => ['Admin', 'Funcionario'].includes(rol))
  );

  tramites = signal<Tramite[]>([]);

  cargando = signal(false);

  error = signal('');

  nuevoTipoTramiteId: number | null = null;
  nuevaDescripcion = '';
  creando = signal(false);
  errorCreacion = signal('');

  actualizandoEstadoId = signal<number | null>(null);

  // Se usa effect (no ngOnInit) porque puedeGestionar depende de los roles,
  // que pueden llegar despues de que este componente ya se construyo.
  constructor() {
    effect(() => {
      this.puedeGestionar();
      this.cargarTramites();
    });
  }

  // Trae todos los trámites si puede gestionar, o solo los propios si no.
  cargarTramites(): void {
    this.cargando.set(true);
    this.error.set('');

    const consulta$ = this.puedeGestionar()
      ? this.apiService.getTodosTramites()
      : this.apiService.getMisTramites();

    consulta$.subscribe({
      next: (tramites) => {
        this.tramites.set(tramites);
        this.cargando.set(false);
      },

      error: (err) => {
        this.error.set(this.formatearError(err));
        this.cargando.set(false);
      },
    });
  }

  crearTramite(): void {
    if (!this.nuevoTipoTramiteId || !this.nuevaDescripcion.trim()) {
      this.errorCreacion.set('Debes indicar el tipo de trámite y una descripción.');
      return;
    }

    this.creando.set(true);
    this.errorCreacion.set('');

    this.apiService
      .crearTramite({
        tipoTramiteId: this.nuevoTipoTramiteId,
        descripcion: this.nuevaDescripcion.trim(),
      })
      .subscribe({
        next: () => {
          this.creando.set(false);
          this.nuevoTipoTramiteId = null;
          this.nuevaDescripcion = '';
          this.cargarTramites();
        },

        error: (err) => {
          this.errorCreacion.set(this.formatearError(err));
          this.creando.set(false);
        },
      });
  }

  // Transiciones válidas desde el estado actual, según la máquina de estados del modelo.
  transicionesValidas(estado: EstadoTramite): EstadoTramite[] {
    return TRANSICIONES_ESTADO[estado];
  }

  cambiarEstado(tramite: Tramite, nuevoEstado: EstadoTramite): void {
    this.actualizandoEstadoId.set(tramite.id);
    this.error.set('');

    this.apiService
      .cambiarEstadoTramite(tramite.id, { estado: nuevoEstado })
      .subscribe({
        next: (actualizado) => {
          this.tramites.update((lista) =>
            lista.map((t) => (t.id === actualizado.id ? actualizado : t))
          );
          this.actualizandoEstadoId.set(null);
        },

        error: (err) => {
          this.error.set(this.formatearError(err));
          this.actualizandoEstadoId.set(null);
        },
      });
  }

  // Traduce errores 403/409 del backend a mensajes legibles.
  private formatearError(err: unknown): string {
    const httpError = err as { status?: number; statusText?: string };

    if (httpError?.status === 403) {
      return 'No tienes permisos para realizar esta acción (403).';
    }

    if (httpError?.status === 409) {
      return 'La transición de estado no es válida (409).';
    }

    return `Error ${httpError?.status ?? ''}: ${httpError?.statusText || 'No se pudo completar la operación'}`;
  }
}
