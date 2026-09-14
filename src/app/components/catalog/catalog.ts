import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { TipoTramite } from '../../models/tipo-tramite.model';

// Catálogo de tipos de trámite: Admin crea/edita/elimina, Funcionario solo edita.
@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class CatalogComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  esAdmin = this.authService.hasRole('Admin');

  puedeEditar = this.authService.hasAnyRole(['Admin', 'Funcionario']);

  tipos = signal<TipoTramite[]>([]);

  cargando = signal(false);

  error = signal('');

  nuevoNombre = '';
  nuevaDescripcion = '';
  nuevosRequisitos = '';
  nuevoCupoDiario: number | null = null;
  creando = signal(false);
  errorCreacion = signal('');

  idEnEdicion = signal<number | null>(null);
  edicionCupoDiario: number | null = null;
  edicionActivo = true;
  guardando = signal(false);

  eliminandoId = signal<number | null>(null);

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.cargando.set(true);
    this.error.set('');

    this.apiService.getCatalogo().subscribe({
      next: (tipos) => {
        this.tipos.set(tipos);
        this.cargando.set(false);
      },

      error: (err) => {
        this.error.set(this.formatearError(err));
        this.cargando.set(false);
      },
    });
  }

  crearTipoTramite(): void {
    if (!this.nuevoNombre.trim() || !this.nuevoCupoDiario) {
      this.errorCreacion.set('Debes indicar al menos el nombre y el cupo diario.');
      return;
    }

    this.creando.set(true);
    this.errorCreacion.set('');

    this.apiService
      .crearTipoTramite({
        nombre: this.nuevoNombre.trim(),
        descripcion: this.nuevaDescripcion.trim(),
        requisitos: this.nuevosRequisitos.trim() || undefined,
        cupoDiario: this.nuevoCupoDiario,
      })
      .subscribe({
        next: () => {
          this.creando.set(false);
          this.nuevoNombre = '';
          this.nuevaDescripcion = '';
          this.nuevosRequisitos = '';
          this.nuevoCupoDiario = null;
          this.cargarCatalogo();
        },

        error: (err) => {
          this.errorCreacion.set(this.formatearError(err));
          this.creando.set(false);
        },
      });
  }

  iniciarEdicion(tipo: TipoTramite): void {
    this.idEnEdicion.set(tipo.id);
    this.edicionCupoDiario = tipo.cupoDiario;
    this.edicionActivo = tipo.activo;
  }

  cancelarEdicion(): void {
    this.idEnEdicion.set(null);
  }

  guardarEdicion(tipo: TipoTramite): void {
    if (!this.edicionCupoDiario) {
      return;
    }

    this.guardando.set(true);
    this.error.set('');

    this.apiService
      .actualizarTipoTramite(tipo.id, {
        nombre: tipo.nombre,
        descripcion: tipo.descripcion,
        requisitos: tipo.requisitos ?? undefined,
        cupoDiario: this.edicionCupoDiario,
        activo: this.edicionActivo,
      })
      .subscribe({
        next: (actualizado) => {
          this.tipos.update((lista) =>
            lista.map((t) => (t.id === actualizado.id ? actualizado : t))
          );
          this.guardando.set(false);
          this.idEnEdicion.set(null);
        },

        error: (err) => {
          this.error.set(this.formatearError(err));
          this.guardando.set(false);
        },
      });
  }

  // Solo Admin puede eliminar (la UI oculta el botón para los demás roles).
  eliminarTipoTramite(tipo: TipoTramite): void {
    this.eliminandoId.set(tipo.id);
    this.error.set('');

    this.apiService.eliminarTipoTramite(tipo.id).subscribe({
      next: () => {
        this.tipos.update((lista) => lista.filter((t) => t.id !== tipo.id));
        this.eliminandoId.set(null);
      },

      error: (err) => {
        this.error.set(this.formatearError(err));
        this.eliminandoId.set(null);
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
      return 'La operación no es válida en este momento (409).';
    }

    return `Error ${httpError?.status ?? ''}: ${httpError?.statusText || 'No se pudo completar la operación'}`;
  }
}
