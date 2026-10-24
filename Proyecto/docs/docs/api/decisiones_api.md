# Decisiones API-First — Componente 3

- **Contrato primero:** `openapi.yaml` define las rutas, parámetros, autenticación, esquemas y respuestas antes de consumir la API.
- **REST sobre HTTP:** recursos representados como `/productos`; métodos GET/POST/PUT/DELETE expresan operaciones.
- **Autenticación:** `POST /auth/login` devuelve JWT; las rutas de productos requieren `Authorization: Bearer <token>`.
- **Errores:** `application/problem+json` basado en RFC 9457, usando estados HTTP definidos por RFC 9110.
- **Persistencia:** MySQL `farmacia_galeno`, tablas `usuarios`, `categorias`, `productos`; consultas parametrizadas con `mysql2`.
- **Caché:** patrón Cache-Aside en memoria con TTL de 30 s para listados/detalle. Se invalida al crear, actualizar o borrar. Es una demostración local; en múltiples instancias se recomienda Redis.
- **GraphQL/gRPC:** no implementados como endpoints en este entregable; quedan como alternativas de integración. REST/OpenAPI es la interfaz operativa evaluable.
- **Seguridad académica:** credenciales y secreto JWT en `.env` no versionado; no subir `.env` a Git.
