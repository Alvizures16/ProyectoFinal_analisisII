# Matriz de trazabilidad API / BDD / pruebas

| Requisito | Contrato OpenAPI | Escenario Gherkin | Prueba automatizada/manual |
|---|---|---|---|
| REQ-API-01 Iniciar sesión con credenciales válidas | `POST /api/v1/auth/login` | `features/autenticacion.feature` escenario credenciales válidas | Postman: Login correcto |
| REQ-API-02 Rechazar credenciales inválidas | `POST /api/v1/auth/login` 401 | `features/autenticacion.feature` escenario outline inválido | Postman: Login incorrecto |
| REQ-API-03 Listar y filtrar productos con token | `GET /api/v1/productos` | `features/productos.feature` listar y filtrar | Postman: Listar/filtrar |
| REQ-API-04 Consultar producto por ID | `GET /api/v1/productos/{id}` | `features/productos.feature` consulta por ID | Postman: Detalle |
| REQ-API-05 Crear producto validado | `POST /api/v1/productos` | `features/productos.feature` crear producto | Postman: Crear |
| REQ-API-06 Actualizar producto | `PUT /api/v1/productos/{id}` | `features/productos.feature` actualizar | Postman: Actualizar |
| REQ-API-07 Eliminar producto | `DELETE /api/v1/productos/{id}` | `features/productos.feature` eliminar | Postman: Eliminar |
| REQ-API-08 Error uniforme RFC 9457 | Todas las rutas con error | Escenarios de 400/401/404 | Ver `Content-Type: application/problem+json` |
| REQ-API-09 Consulta con caché TTL | `GET /api/v1/productos` y `/productos/{id}` | `features/productos.feature` caché | Revisar cabecera `X-Cache: MISS/HIT` |

## Criterio de aceptación
Cada requisito tiene una operación documentada, un escenario Gherkin y un procedimiento de prueba. Los `.feature` son especificaciones Gherkin; para ejecutarlos automáticamente como Cucumber, se requiere añadir un runner/step definitions. Las pruebas incluidas en `tests/` verifican lógica de validación sin requerir la BD real.
