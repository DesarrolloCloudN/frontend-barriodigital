// Representa un tipo de trámite tal como llega desde el backend (catálogo).
export interface TipoTramite {
  id: number;
  nombre: string;
  descripcion: string;
  requisitos?: string | null;
  cupoDiario: number;
  cupoDisponibleHoy: number;
  activo: boolean;
}

// Datos que se envían al backend para crear un nuevo tipo de trámite.
export interface CrearTipoTramiteDto {
  nombre: string;
  descripcion: string;
  requisitos?: string;
  cupoDiario: number;
}

// Datos que se envían al backend para actualizar un tipo de trámite existente.
export interface ActualizarTipoTramiteDto {
  nombre: string;
  descripcion: string;
  requisitos?: string;
  cupoDiario: number;
  activo: boolean;
}
