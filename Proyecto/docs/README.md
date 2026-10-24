# Componente 3 — Farmacia Galeno API (MySQL + API-First)

Proyecto listo para abrir en Visual Studio Code. Se conecta a la base real `farmacia_galeno` Kali Linux; no utiliza JSON como almacenamiento.

## 1. Requisitos en Windows
- Node.js LTS (20 o superior): https://nodejs.org/
- Visual Studio Code: https://code.visualstudio.com/
- Postman: https://www.postman.com/downloads/ (o extensión Thunder Client).
- MySQL Server ya instalado en Kali Linux VM.

## 2. Antes de cambiar nada: verificar la base real
En Kali abre una terminal y entra a MySQL con tu usuario administrador:
```bash
sudo mysql
```
Después ejecuta:
```sql
SHOW DATABASES LIKE 'farmacia_galeno';
USE farmacia_galeno;
SHOW TABLES;
SHOW CREATE TABLE usuarios\G
SHOW CREATE TABLE categorias\G
SHOW CREATE TABLE productos\G
SELECT id,nombre,email,rol,estado FROM usuarios LIMIT 10;
SELECT id,nombre,precio,stock,categoria_id,estado FROM productos LIMIT 10;
```
Si la BD y las tres tablas existen con columnas compatibles, NO ejecutes scripts de creación ni vuelvas a crear tablas. Si faltan tablas, revisa `database/01_schema_si_no_existe.sql`: usa `CREATE TABLE IF NOT EXISTS` y no elimina datos, pero verifica primero que las columnas coincidan. Si tus columnas tienen otros nombres, adapta `src/repositories/productRepository.js` y `src/controllers/authController.js` antes de iniciar.

## 3. Asegurar acceso desde Windows a Kali
La IP real de Kali no está fijada en el proyecto: debes consultar la IP actual, no copiar una inventada.
En Kali:
```bash
ip -4 addr
```
Busca la IP de la interfaz que conecta con Windows/VirtualBox (no `127.0.0.1`). En VirtualBox puedes usar una red **Host-only** para comunicar Windows con Kali; si ya tienes una red configurada y funciona, consérvala.

Comprueba MySQL en Kali:
```bash
sudo systemctl status mysql --no-pager
sudo ss -lntp | grep 3306
```
Si MySQL solo escucha en `127.0.0.1`, edita el archivo:
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```
Busca `bind-address`. Cámbialo a `0.0.0.0` solo para una red privada de laboratorio, guarda y reinicia:
```bash
sudo systemctl restart mysql
sudo ss -lntp | grep 3306
```
No expongas el puerto 3306 a Internet. Si usas firewall, permite 3306 únicamente desde la IP de Windows o la subred host-only. Si `ufw` está activo, revisa primero `sudo ufw status`; no abras el puerto globalmente sin restricción.

## 4. Verificar/crear el usuario de API (solo si hace falta)
En Kali:
```bash
sudo mysql
```
Verifica si existe:
```sql
SELECT user, host FROM mysql.user WHERE user='galeno_api';
SHOW GRANTS FOR 'galeno_api'@'%';
```
Si ya existe y tiene acceso a `farmacia_galeno.*`, conserva su contraseña actual y no recrees nada. Si no existe, crea uno con una contraseña nueva y segura (no pegues esa contraseña en el repositorio):
```sql
CREATE USER 'galeno_api'@'%' IDENTIFIED BY 'PON_AQUI_UNA_CLAVE_SEGURA';
GRANT SELECT, INSERT, UPDATE, DELETE ON farmacia_galeno.* TO 'galeno_api'@'%';
FLUSH PRIVILEGES;
```
`'%'` permite cualquier origen que llegue al servidor; la seguridad debe limitarse con red privada/firewall. Si conoces la IP de Windows, es mejor sustituir `%` por esa IP en la definición del usuario. La clave `Galeno2026*` se mencionó como propuesta anteriormente, pero no se ha verificado que siga configurada; usa la contraseña real que tienes.

## 5. Comprobar la red desde Windows
Abre PowerShell (Windows), sustituyendo la IP:
```powershell
Test-NetConnection IP_DE_KALI -Port 3306
```
Debe mostrar `TcpTestSucceeded : True`. Si sale False, no sigas con Node todavía: revisa modo de red de VirtualBox, IP, `bind-address`, servicio MySQL y firewall.

## 6. Preparar proyecto en VS Code
1. Descomprime el ZIP.
2. En VS Code elige **File > Open Folder** y abre `componente3_api_first_mysql`.
3. Copia `.env.example` y nombra la copia `.env` (en Windows puedes usar `Copy-Item .env.example .env`).
4. Edita `.env` con la IP de Kali y la contraseña real de `galeno_api`:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=pon_aqui_una_cadena_larga_unica
JWT_EXPIRES_IN=2h
DB_HOST=IP_REAL_DE_KALI
DB_PORT=3306
DB_USER=galeno_api
DB_PASSWORD=CONTRASENA_REAL
DB_NAME=farmacia_galeno
DB_CONNECTION_LIMIT=10
```
No escribas comillas alrededor de los valores. No entregues el archivo `.env`; entrega solo `.env.example`.

En la terminal integrada de VS Code:
```powershell
node -v
npm -v
npm install
npm start
```
La consola debe decir `MySQL conectado: farmacia_galeno` y `Farmacia Galeno API ejecutándose en http://localhost:3000`. Si no conecta, revisa el mensaje de error y la sección de solución de problemas.

## 7. Probar con navegador/Postman
Primero abre `http://localhost:3000/api/v1/health`; debe devolver `status: ok`. Importa `docs/api/postman_collection.json` en Postman. La colección usa `baseUrl=http://localhost:3000/api/v1` y guarda el JWT en la variable `token` después del login.

**Login:** `POST /auth/login`, JSON:
```json
{"email":"CORREO_REAL_DE_UN_USUARIO","password":"CONTRASENA_REAL_DEL_USUARIO"}
```
Usa un usuario existente en `usuarios`. No se inventa una cuenta de login en la base real. Si no tienes un usuario de prueba, crea uno con contraseña bcrypt (ver abajo). Una vez que login responda 200, la colección almacena token y las demás peticiones usarán `Bearer {{token}}`.

### Crear un usuario de prueba (solo si no existe ninguno utilizable)
La forma segura es generar un hash bcrypt con Node. En la terminal de proyecto ejecuta:
```powershell
node -e "const b=require('bcryptjs'); console.log(b.hashSync('Cambiar123!',10))"
```
Copia el hash generado. En Kali ejecuta un `INSERT` usando el hash y un correo de prueba que no exista:
```sql
USE farmacia_galeno;
INSERT INTO usuarios (nombre,email,password,rol,estado)
VALUES ('Usuario API','api.pruebas@galeno.local','PEGA_AQUI_EL_HASH_BCRYPT','ADMIN',1);
```
Luego inicia sesión con `api.pruebas@galeno.local` y `Cambiar123!`. No guardes esa contraseña en archivos del repositorio. Si tu esquema difiere, adapta el INSERT a las columnas reales.

### Endpoints incluidos
- `GET /api/v1/health` — comprobación sin autenticación.
- `POST /api/v1/auth/login` — login y JWT.
- `GET /api/v1/productos?q=acetaminofen&estado=true&categoria_id=1` — lista/filtro + caché.
- `GET /api/v1/productos/1` — detalle.
- `POST /api/v1/productos` — crear (requiere nombre y precio > 0).
- `PUT /api/v1/productos/1` — actualizar.
- `DELETE /api/v1/productos/1` — eliminar.

Para rutas de productos, cabecera: `Authorization: Bearer TOKEN`. En GET revisa `X-Cache: MISS` la primera vez y `HIT` si repites la misma consulta dentro de 30 segundos.

Ejemplo para crear producto:
```json
{"nombre":"Vitamina C 500mg","descripcion":"Frasco de ejemplo","precio":35.5,"stock":20,"categoria_id":3,"estado":true}
```

## 8. Pruebas automatizadas y Gherkin
En otra terminal ejecuta `npm test`. Estas pruebas cubren validación de campos sin tocar la base de datos. Los archivos `features/*.feature` son escenarios de aceptación Gherkin para el entregable; la colección Postman es el procedimiento de prueba manual. El ZIP no incluye un runner Cucumber, por lo tanto no declares que los `.feature` se ejecutaron automáticamente.

## 9. Documentos de entrega
- `docs/api/openapi.yaml`: contrato OpenAPI 3.0.3.
- `docs/api/postman_collection.json`: colección importable.
- `features/*.feature`: BDD Gherkin con esquemas y ejemplos.
- `docs/api/matriz_trazabilidad.md`: requisito → endpoint → escenario → prueba.
- `docs/api/decisiones_api.md`: decisiones API-First, caché y GraphQL/gRPC conceptual.
- `tests/api.test.js`: pruebas de validación.
- `database/`: scripts SQL de referencia; no ejecutar a ciegas sobre una BD existente.

## 10. Solución de problemas
- `ECONNREFUSED`: MySQL no escucha en la IP/puerto o firewall/red bloquea.
- `ETIMEDOUT`: IP equivocada, adaptador de red o firewall.
- `Access denied for user`: usuario/contraseña/grants o host del usuario MySQL.
- `Unknown database`: verifica `SHOW DATABASES;`.
- `Unknown column` / `Table doesn't exist`: compara `SHOW CREATE TABLE` con el repositorio; adapta los nombres en el código, no borres tablas reales.
- Login 401: usa email/contraseña de usuario activo. El código compara bcrypt si la contraseña está hasheada y admite texto plano solo como compatibilidad temporal de laboratorio; en un sistema real todas las contraseñas deben guardarse como hash bcrypt.

## Alcance y honestidad de implementación
La API sí consulta y modifica MySQL directamente. La caché TTL está en memoria del proceso (no Redis), apropiada para demostrar Cache-Aside en una instancia local. GraphQL y gRPC se describen como alternativas conceptuales, no como servicios implementados. Los escenarios Gherkin están escritos, pero no automatizados con Cucumber.
