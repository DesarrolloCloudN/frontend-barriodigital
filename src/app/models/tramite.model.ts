// Todos los estados posibles por los que puede pasar un trámite.
export type EstadoTramite =
  | 'INGRESADO'
  | 'ADMITIDO'
  | 'EN_GESTION'
  | 'EN_TERRENO'
  | 'RESUELTO'
  | 'RECHAZADO';

// Representa un trámite tal como llega desde el backend.
export interface Tramite {
  id: number;
  tipoTramiteId: number;
  vecinoId: string;
  vecinoNombre: string;
  descripcion: string;
  estado: EstadoTramite;
  funcionarioAsignado?: string | null;
  observaciones?: string | null;
  fechaIngreso: string;
  fechaActualizacion: string;
}

// Datos que se envían al backend para crear un nuevo trámite.
export interface CrearTramiteDto {
  tipoTramiteId: number;
  descripcion: string;
  vecinoId?: string;
  vecinoNombre?: string;
}

// Datos que se envían al backend para cambiar el estado de un trámite.
export interface CambiarEstadoTramiteDto {
  estado: EstadoTramite;
  funcionarioAsignado?: string;
  observaciones?: string;
}

/**
 * Máquina de estados del trámite (sección 5 del contrato). Se replica aquí solo para
 * habilitar/deshabilitar transiciones en la UI; la validación real vive en el backend.
 */
export const TRANSICIONES_ESTADO: Record<EstadoTramite, EstadoTramite[]> = {
  INGRESADO: ['ADMITIDO', 'RECHAZADO'],
  ADMITIDO: ['EN_GESTION', 'RECHAZADO'],
  EN_GESTION: ['EN_TERRENO', 'RECHAZADO'],
  EN_TERRENO: ['RESUELTO', 'RECHAZADO'],
  RESUELTO: [],
  RECHAZADO: [],
};
