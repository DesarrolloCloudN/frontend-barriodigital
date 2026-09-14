// Todos los estados posibles por los que puede pasar un trámite.
export type EstadoTramite =
  | 'INGRESADO'
  | 'ADMITIDO'
  | 'EN_GESTION'
  | 'EN_TERRENO'
  | 'RESUELTO'
  | 'RECHAZADO';

export interface Tramite {
  id: number;
  tipoTramiteId: number;
  vecinoId: string;
  vecinoNombre: string;
  descripcion: string;
  estado: EstadoTramite;
  responsableAsignado?: string | null;
  observaciones?: string | null;
  fechaIngreso: string;
  fechaActualizacion: string;
}

export interface CrearTramiteDto {
  tipoTramiteId: number;
  descripcion: string;
  vecinoId?: string;
  vecinoNombre?: string;
}

export interface CambiarEstadoTramiteDto {
  estado: EstadoTramite;
  responsableAsignado?: string;
  observaciones?: string;
}

// Máquina de estados del trámite, solo para habilitar/deshabilitar botones en la UI.
export const TRANSICIONES_ESTADO: Record<EstadoTramite, EstadoTramite[]> = {
  INGRESADO: ['ADMITIDO', 'RECHAZADO'],
  ADMITIDO: ['EN_GESTION', 'RECHAZADO'],
  EN_GESTION: ['EN_TERRENO', 'RECHAZADO'],
  EN_TERRENO: ['RESUELTO', 'RECHAZADO'],
  RESUELTO: [],
  RECHAZADO: [],
};
