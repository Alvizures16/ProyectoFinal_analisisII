\# ADR-002: Estrategia de Persistencia Políglota y Gestión de Caché para Compras Farmacéuticas



\## Estado

\*\*Aprobado\*\*



\## Contexto

El Sistema de Gestión de Compras de Farmacias Galeno maneja información con requerimientos de almacenamiento y patrones de acceso heterogéneos\[cite: 18]:

1\. \*\*Transacciones financieras y legales:\*\* Órdenes de compra, recepción de lotes, facturación (FEL) y cuentas por pagar que exigen consistencia estricta (propiedades ACID)\[cite: 18, 21].

2\. \*\*Catálogo de medicamentos:\*\* Fichas técnicas farmacéuticas con atributos dinámicos (principios activos, condiciones de almacenamiento, registros sanitarios, presentaciones) que varían entre productos\[cite: 18, 23].

3\. \*\*Alto tráfico de lectura:\*\* Consultas masivas y en tiempo real sobre el stock e inventario de medicamentos por parte de las sucursales\[cite: 17, 18].

4\. \*\*Relaciones complejas:\*\* Análisis de equivalencias, sustitutos de medicamentos por principio activo y red de distribuidores.



Intentar forzar todos estos modelos de datos dentro de una sola base de datos relacional tradicional genera problemas de desempeño, esquemas rígidos e ineficiencia en consultas complejas\[cite: 16, 18].



\## Opciones Evaluadas

1\. \*\*Base de Datos Unificada Relacional (PostgreSQL como motor único):\*\* Garantiza consistencia transaccional, pero genera rigidez en el catálogo de medicamentos y cuellos de botella en la caché de stock\[cite: 16, 18].

2\. \*\*Base de Datos Unificada NoSQL (MongoDB como motor único):\*\* Aporta flexibilidad documental, pero carece del soporte nativo para transacciones financieras complejas con la rigidez requerida por contabilidad y la SAT\[cite: 18, 21].

3\. \*\*Arquitectura de Persistencia Políglota (PostgreSQL + MongoDB + Redis + Neo4j):\*\* Combina motores relacionales, documentales, en memoria y de grafos para que cada tecnología resuelva la necesidad específica de su dominio\[cite: 18, 22].



\## Decisión Elegida

Implementar una arquitectura de \*\*Persistencia Políglota\*\*, asignando la tecnología de almacenamiento especializada para cada necesidad del dominio farmacéutico\[cite: 18, 22]:



\* \*\*PostgreSQL (Relacional):\*\* Utilizado para transacciones contables, órdenes de compra, detalle de pedidos, registro de lotes de medicamentos y proveedores (Garantía ACID)\[cite: 18, 21].

\* \*\*MongoDB (Documental):\*\* Almacenamiento del catálogo general de medicamentos, fichas técnicas, combinaciones de principios activos y formatos de presentación en documentos BSON flexibles\[cite: 18, 23].

\* \*\*Redis (En Memoria):\*\* Implementación del patrón \*\*Cache-Aside\*\* con políticas de expiración por tiempo de vida (TTL) para acelerar las consultas de stock disponible y precios vigentes en milisegundos\[cite: 17, 18, 22].

\* \*\*Neo4j (Grafos):\*\* Modelado y consulta rápida de la red de medicamentos equivalentes, sustitutos por principio activo y trazabilidad de proveedores\[cite: 18, 22].



\## Consecuencias



\### Positivas (+)

\* \*\*Desempeño Óptimo:\*\* Las consultas frecuentes de inventario se resuelven a velocidad sub-milisegundo mediante Redis\[cite: 17, 18].

\* \*\*Flexibilidad en el Catálogo:\*\* Los medicamentos pueden incluir nuevos atributos o propiedades de laboratorio en MongoDB sin alterar esquemas relacionales existentes\[cite: 18, 23].

\* \*\*Integridad Financiera:\*\* PostgreSQL asegura que las órdenes de compra y facturas cumplan estrictamente con las reglas contables y requerimientos de la SAT\[cite: 18, 21].

\* \*\*Alta Disponibilidad y Resiliencia:\*\* Cada motor opera de forma independiente; si un motor secundario falla, no interrumpe el procesamiento transaccional de compras\[cite: 16, 18].



\### Negativas / Desafíos (-)

\* \*\*Gestión de Consistencia Eventual:\*\* Requiere manejar sincronización asíncrona entre las ordenes guardadas en PostgreSQL y las actualizaciones de catálogo/stock en MongoDB y Redis\[cite: 18].

\* \*\*Complejidad Operativa:\*\* Incremento en el esfuerzo de mantenimiento, respaldos, infraestructura y monitoreo al administrar cuatro tecnologías de bases de datos distintas\[cite: 16, 18].

