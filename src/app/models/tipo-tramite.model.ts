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

export interface CrearTipoTramiteDto {
  nombre: string;
  descripcion: string;
  requisitos?: string;
  cupoDiario: number;
}

export interface ActualizarTipoTramiteDto {
  nombre: string;
  descripcion: string;
  requisitos?: string;
  cupoDiario: number;
  activo: boolean;
}
