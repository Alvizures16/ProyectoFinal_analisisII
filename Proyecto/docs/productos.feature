# language: es
Característica: Administración de productos
  Para mantener el inventario de Farmacia Galeno
  Como usuario autenticado
  Quiero consultar y administrar productos mediante una API REST

  Antecedentes:
    Dado que inicié sesión y tengo un token Bearer válido

  Escenario: Listar productos
    Cuando consulto "GET /api/v1/productos"
    Entonces la respuesta debe ser HTTP 200
    Y debe incluir una lista de productos y metadatos de caché

  Esquema del escenario: Filtrar productos por texto
    Cuando consulto "GET /api/v1/productos?q=<texto>"
    Entonces la respuesta debe ser HTTP 200
    Y los resultados deben coincidir con el filtro solicitado
    Ejemplos:
      | texto       |
      | acetaminofén|
      | vitamina     |

  Escenario: Crear producto con datos válidos
    Cuando envío un producto con nombre, precio positivo, stock y categoría válida a "POST /api/v1/productos"
    Entonces la respuesta debe ser HTTP 201
    Y debe devolver el producto creado y la cabecera Location

  Escenario: Rechazar producto sin nombre
    Cuando envío un producto sin nombre a "POST /api/v1/productos"
    Entonces la respuesta debe ser HTTP 400
    Y el cuerpo debe cumplir RFC 9457 con tipo "application/problem+json"

  Escenario: Consultar ID inexistente
    Cuando consulto "GET /api/v1/productos/999999"
    Entonces la respuesta debe ser HTTP 404
    Y debe recibir un Problem Details

  Escenario: Actualizar producto existente
    Cuando envío cambios válidos a "PUT /api/v1/productos/{id}"
    Entonces la respuesta debe ser HTTP 200
    Y la caché de productos debe invalidarse

  Escenario: Eliminar producto existente
    Cuando envío "DELETE /api/v1/productos/{id}"
    Entonces la respuesta debe ser HTTP 204 sin cuerpo
