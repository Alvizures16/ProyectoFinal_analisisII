# Guion breve para demostrar el Componente 3

1. Mostrar `docs/api/openapi.yaml` y explicar que el contrato define rutas, parámetros, seguridad, esquemas y errores antes de consumir la API.
2. Mostrar en VS Code que la configuración se carga desde `.env` y que el repositorio usa consultas SQL parametrizadas.
3. Ejecutar `GET /api/v1/health` y enseñar el mensaje de conexión a `farmacia_galeno` en consola.
4. Ejecutar login en Postman y explicar que devuelve JWT.
5. Ejecutar `GET /productos` con token; repetirlo y comparar `X-Cache: MISS` / `HIT`.
6. Crear y consultar un producto; probar un precio inválido para recibir HTTP 400 y `application/problem+json`.
7. Mostrar `.feature`, matriz de trazabilidad y colección Postman.

No afirmar que se usa Redis, GraphQL, gRPC o Cucumber ejecutable: en esta versión Redis/GraphQL/gRPC/Cucumber son solo opciones o especificaciones conceptuales; el backend operativo usa Express, MySQL y caché TTL en memoria.
