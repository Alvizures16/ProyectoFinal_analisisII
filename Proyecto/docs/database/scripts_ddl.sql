-- Tabla de Proveedores Farmacéuticos 
CREATE TABLE proveedores (     
id_proveedor SERIAL PRIMARY KEY,     
nombre_laboratorio VARCHAR(150) NOT NULL,     
nit VARCHAR(20) UNIQUE NOT NULL,     
contacto_telefono VARCHAR(20),     
email_contacto VARCHAR(100),     
direccion TEXT,     activo BOOLEAN DEFAULT TRUE, 
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 
 
-- Estado de Órdenes de Compra 
CREATE TYPE estado_orden AS ENUM ('BORRADOR', 'PENDIENTE', 'APROBADA', 'RECIBIDA', 'CANCELADA'); 
 
-- Encabezado de Orden de Compra 
CREATE TABLE ordenes_compra (     
id_orden SERIAL PRIMARY KEY,     
codigo_orden VARCHAR(50) UNIQUE NOT NULL,     
id_proveedor INT REFERENCES proveedores(id_proveedor),     
fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     
monto_total NUMERIC(12, 2) NOT NULL,     
estado estado_orden DEFAULT 'BORRADOR',     
id_usuario_comprador INT NOT NULL 
); 
 
-- Detalle de Orden de Compra (Medicamentos solicitados) 
CREATE TABLE detalle_orden_compra (     
id_detalle SERIAL PRIMARY KEY, 
id_orden INT REFERENCES ordenes_compra(id_orden) ON DELETE CASCADE, 
id_medicamento_ref VARCHAR(50) NOT NULL, -- Referencia a MongoDB     cantidad INT NOT NULL CHECK (cantidad > 0),     precio_unitario NUMERIC(10, 2) NOT NULL, 
subtotal NUMERIC(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED 
); 
 
-- Registro de Recepción de Lotes y Vencimientos 
CREATE TABLE lotes_medicamentos (     
id_lote SERIAL PRIMARY KEY,     
numero_lote VARCHAR(50) NOT NULL, 
id_detalle_orden INT REFERENCES detalle_orden_compra(id_detalle),     
fecha_fabricacion DATE NOT NULL,     
fecha_vencimiento DATE NOT NULL,     
cantidad_recibida INT NOT NULL, 
temperatura_requerida VARCHAR(50), -- Ej. 2°C a 8°C 
(Refrigeración) 
 CONSTRAINT chk_vencimiento CHECK (fecha_vencimiento > fecha_fabricacion) 
); 


-- BASE DE DATOS MONGODB
// Colección: medicamentos 
{ 
  "_id": ObjectId("65301234abcd5678ef901234"), 
  "codigo_barras": "7401234567890", 
  "nombre_comercial": "Amoxicilina Galeno 500mg", 
  "nombre_generico": "Amoxicilina", 
  "laboratorio": { 
    "id_proveedor_ref": 1, 
    "nombre": "Laboratorios Galeno S.A." 
  }, 
  "categoria": "Antibióticos", 
  "registro_sanitarios_pt": "PF-12345-2024", 
  "requiere_receta": true, 
  "cadena_frio": false, 
  "principios_activos": [ 
    { 
      "sustancia": "Amoxicilina Trihidrato", 
      "concentracion": "500 mg" 
    } 
  ], 
  "presentaciones": [ 
    { 
      "tipo": "Caja", 
      "unidades": 30, 
      "codigo_presentacion": "CX-30" 
    } 
  ], 
  "condiciones_almacenamiento": { 
    "temperatura_max_celsius": 30, 
    "humedad_max_porcentaje": 65 
  }, 
  "etiquetas": ["antibiotico", "infeccion", "oral"], 
  "actualizado_en": ISODate("2026-10-19T12:00:00Z") 
}
