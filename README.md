# BarrioDigital — Frontend

Frontend en Angular del sistema BarrioDigital (gestión de trámites vecinales), parte de la Evaluación Parcial 1
de Desarrollo Cloud Native I. Usa MSAL para autenticarse contra Microsoft Entra ID y consume el BFF a través de
AWS API Gateway.

Este proyecto se generó con [Angular CLI](https://github.com/angular/angular-cli) versión 21.2.1.

## Roles

- **Admin**: gestiona el catálogo de tipos de trámite, admite solicitudes y cambia el estado de los trámites.
- **Vecino**: ingresa y sigue únicamente sus propias solicitudes.

## Configuración previa

Antes de levantar el proyecto hay que completar los datos de Microsoft Entra ID y del API Gateway en
`src/environments/environment.ts` (los campos marcados como `TODO-CONFIG`).

## Servidor de desarrollo

Para levantar un servidor local, ejecutar:

```bash
ng serve
```

Con el servidor corriendo, abrir el navegador en `http://localhost:4200/`. La aplicación se recarga sola cada vez
que se modifica el código fuente.

## Generar componentes

Para generar un componente nuevo:

```bash
ng generate component nombre-del-componente
```

Para ver todos los esquemas disponibles (componentes, directivas, pipes, etc.):

```bash
ng generate --help
```

## Compilar

Para compilar el proyecto:

```bash
ng build
```

Esto genera los archivos de producción en la carpeta `dist/`.

## Pruebas unitarias

Para ejecutar las pruebas unitarias con [Vitest](https://vitest.dev/):

```bash
ng test
```

## Recursos adicionales

Más información sobre Angular CLI en la [documentación oficial](https://angular.dev/tools/cli).
