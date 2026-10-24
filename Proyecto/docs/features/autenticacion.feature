# language: es
Característica: Autenticación de usuarios de Farmacia Galeno
  Para proteger las operaciones de productos
  Como usuario registrado
  Quiero iniciar sesión con mis credenciales

  Escenario: Inicio de sesión válido
    Dado que existe un usuario activo en la base de datos
    Cuando envío su correo y contraseña correctos a "POST /api/v1/auth/login"
    Entonces la respuesta debe ser HTTP 200
    Y debe incluir un token JWT y los datos públicos del usuario

  Esquema del escenario: Rechazo de credenciales inválidas
    Dado que el endpoint de autenticación está disponible
    Cuando envío el correo "<email>" y la contraseña "<password>"
    Entonces la respuesta debe ser HTTP 401
    Y el tipo de contenido debe ser "application/problem+json"
    Ejemplos:
      | email                 | password       |
      | inexistente@galeno.local | incorrecta  |
      | admin@galeno.local    | contraseña-mal |
