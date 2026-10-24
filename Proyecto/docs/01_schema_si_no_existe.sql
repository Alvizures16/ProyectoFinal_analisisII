-- Ejecutar dentro de MySQL. CREATE TABLE IF NOT EXISTS NO borra tablas existentes.
-- Antes de ejecutar, inspeccione las tablas con SHOW CREATE TABLE (README).
USE farmacia_galeno;

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NULL,
  estado BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255) NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  categoria_id INT NULL,
  estado BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('ADMIN','EMPLEADO') NOT NULL DEFAULT 'EMPLEADO',
  estado BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo opcionales. No inserta categorías repetidas si el nombre ya existe.
INSERT INTO categorias (nombre, descripcion) SELECT 'Analgésicos', 'Medicamentos para aliviar el dolor' WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre='Analgésicos');
INSERT INTO categorias (nombre, descripcion) SELECT 'Antibióticos', 'Medicamentos antibióticos' WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre='Antibióticos');
INSERT INTO categorias (nombre, descripcion) SELECT 'Vitaminas', 'Vitaminas y suplementos' WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre='Vitaminas');
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Acetaminofén 500mg', 'Presentación de ejemplo', 15.50, 100, c.id FROM categorias c
WHERE c.nombre='Analgésicos' AND NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Acetaminofén 500mg');
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
SELECT 'Ibuprofeno 400mg', 'Presentación de ejemplo', 22.75, 80, c.id FROM categorias c
WHERE c.nombre='Analgésicos' AND NOT EXISTS (SELECT 1 FROM productos WHERE nombre='Ibuprofeno 400mg');
