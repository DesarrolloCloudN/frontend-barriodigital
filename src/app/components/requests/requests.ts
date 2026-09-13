import { Component, inject, OnInit, signal } from '@angular/core';
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

// Pantalla de trámites. Un vecino ve y crea sus propios trámites; un Admin o Funcionario
// ve todos los trámites y además puede cambiarles el estado (INGRESADO, ADMITIDO, etc.).
@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './requests.html',
  styleUrl: './requests.scss',
})
export class RequestsComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  // Admin o Funcionario pueden ver todos los trámites y gestionar sus estados.
  puedeGestionar = this.authService.hasAnyRole(['Admin', 'Funcionario']);

  tramites = signal<Tramite[]>([]);

  cargando = signal(false);

  error = signal('');

  // Formulario de creación.
  nuevoTipoTramiteId: number | null = null;
  nuevaDescripcion = '';
  creando = signal(false);
  errorCreacion = signal('');

  // Trámite cuyo estado se está cambiando (para deshabilitar botones mientras dura la llamada).
  actualizandoEstadoId = signal<number | null>(null);

  // Al entrar a la pantalla, carga la lista de trámites.
  ngOnInit(): void {
    this.cargarTramites();
  }

  // Pide al backend la lista de trámites: si el usuario puede gestionar, trae todos;
  // si no, trae solo los suyos.
  cargarTramites(): void {
    this.cargando.set(true);
    this.error.set('');

    const consulta$ = this.puedeGestionar
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

  // Crea un trámite nuevo con los datos del formulario, validando antes que estén completos.
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

  // Devuelve a qué estados se puede pasar desde el estado actual, según la máquina de
  // estados definida en el modelo (por ejemplo, desde INGRESADO solo se puede pasar a
  // ADMITIDO o RECHAZADO). Se usa para mostrar solo los botones de transición válidos.
  transicionesValidas(estado: EstadoTramite): EstadoTramite[] {
    return TRANSICIONES_ESTADO[estado];
  }

  // Cambia el estado de un trámite (por ejemplo, de INGRESADO a ADMITIDO) y actualiza la
  // lista en pantalla con el trámite ya actualizado.
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

  // Convierte un error HTTP en un mensaje simple y entendible para mostrar en pantalla.
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
