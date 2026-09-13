import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { TipoTramite } from '../../models/tipo-tramite.model';

// Pantalla del catálogo de tipos de trámite. Un Admin puede crear, editar y eliminar tipos
// de trámite; un Funcionario solo puede editarlos; cualquier otro rol solo los ve en modo lectura.
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

  // Solo el Admin puede crear y eliminar tipos de trámite.
  esAdmin = this.authService.hasRole('Admin');

  // Admin y Funcionario pueden editar los tipos de trámite existentes.
  puedeEditar = this.authService.hasAnyRole(['Admin', 'Funcionario']);

  tipos = signal<TipoTramite[]>([]);

  cargando = signal(false);

  error = signal('');

  // Formulario de creación (solo Admin).
  nuevoNombre = '';
  nuevaDescripcion = '';
  nuevosRequisitos = '';
  nuevoCupoDiario: number | null = null;
  creando = signal(false);
  errorCreacion = signal('');

  // Edición inline.
  idEnEdicion = signal<number | null>(null);
  edicionCupoDiario: number | null = null;
  edicionActivo = true;
  guardando = signal(false);

  eliminandoId = signal<number | null>(null);

  // Al entrar a la pantalla, carga el catálogo de tipos de trámite.
  ngOnInit(): void {
    this.cargarCatalogo();
  }

  // Pide al backend la lista completa de tipos de trámite.
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

  // Crea un nuevo tipo de trámite con los datos del formulario (solo disponible para Admin).
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

  // Activa el modo edición inline para la fila del tipo de trámite indicado, precargando
  // sus valores actuales en los campos editables.
  iniciarEdicion(tipo: TipoTramite): void {
    this.idEnEdicion.set(tipo.id);
    this.edicionCupoDiario = tipo.cupoDiario;
    this.edicionActivo = tipo.activo;
  }

  // Sale del modo edición sin guardar cambios.
  cancelarEdicion(): void {
    this.idEnEdicion.set(null);
  }

  // Guarda los cambios hechos en la edición inline de un tipo de trámite.
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

  // Elimina un tipo de trámite del catálogo (solo disponible para Admin).
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

  // Convierte un error HTTP en un mensaje simple y entendible para mostrar en pantalla.
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
