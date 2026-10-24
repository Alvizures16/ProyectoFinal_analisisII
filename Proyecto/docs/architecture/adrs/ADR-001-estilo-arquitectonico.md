# ADR-001: Selección del Estilo Arquitectónico para la Gestión de Compras (Farmacias Galeno)

## Estado
**Aprobado**

## Contexto
El Sistema de Gestión de Compras de Farmacias Galeno requiere gestionar la adquisición de medicamentos, control de lotes y fechas de vencimiento, relaciones con proveedores/laboratorios y el reabastecimiento continuo a sucursales[cite: 17]. 

Se evaluaron estilos tradicionales como la Arquitectura en Capas (N-Tier) y Arquitectura Basada en Repositorio, pero presentan limitaciones críticas de acoplamiento, puntos únicos de falla y dificultades de escalabilidad independiente durante periodos de alta demanda o picos de reabastecimiento[cite: 16].

Por lo tanto, se necesita seleccionar un estilo arquitectónico moderno que garantice alta disponibilidad, tolerancia a fallos, desacoplamiento y un procesamiento eficiente de eventos[cite: 16, 17].

## Opciones Evaluadas
1. **Arquitectura en Capas (N-Tier):** Presenta bajo costo inicial y buena separación conceptual, pero su escalado es monolítico y un fallo en un módulo compromete todo el sistema[cite: 16].
2. **Arquitectura Basada en Repositorio:** Eficiente para acceso centralizado a datos, pero la base de datos se convierte en un cuello de botella y punto único de falla ante consultas masivas[cite: 16].
3. **Microservicios + Arquitectura Orientada a Eventos (EDA):** Permite desacoplar los servicios por dominio (Compras, Inventario, Proveedores), escalar según la demanda e integrar mensajería asíncrona mediante un bus de eventos (RabbitMQ) y un API Gateway unificado[cite: 16, 17, 19].

## Decisión Elegida
Adoptar una **Arquitectura de Microservicios combinada con Integración Orientada a Eventos (EDA)**, guiada y protegida por un **API Gateway centralizado**[cite: 17, 19].

### Razón de la Elección:
* **Escalabilidad Elástica:** Los microservicios de Compras e Inventario pueden escalar de forma independiente según la carga de trabajo[cite: 16, 17].
* **Desacoplamiento y Resiliencia:** La comunicación asíncrona vía eventos permite que las solicitudes de orden de compra o recepción de lotes se procesen sin bloquear los flujos del usuario[cite: 16, 17].
* **Aislamiento de Fallas:** La caída de la integración con un proveedor o de un servicio secundario no detiene las operaciones críticas del resto del sistema[cite: 16, 17].

## Consecuencias

### Positivas (+)
* Despliegue e integración independientes de los servicios de compras, inventario/lotes y proveedores[cite: 16, 17].
* Mayor mantenibilidad del código al dividir la lógica en bases de código pequeñas enfocadas en un único dominio[cite: 16, 17].
* Alta disponibilidad para las sucursales al momento de consultar stock o registrar órdenes[cite: 17].
* Procesamiento masivo y asíncrono de eventos mediante colas de mensajes (RabbitMQ)[cite: 16, 17].

### Negativas / Desafíos (-)
* Incremento en la complejidad de despliegue, infraestructura y orquestación de la red.
* Necesidad de gestionar consistencia eventual entre los servicios distribuidos y los distintos motores de bases de datos.
* Requisito de implementar monitoreo distribuido y trazabilidad de peticiones a través del API Gateway[cite: 19].