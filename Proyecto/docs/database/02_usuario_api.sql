-- EJECUTAR COMO administrador de MySQL en Kali.
-- Use la contraseña que realmente configuró. La clave de ejemplo de la conversación anterior fue Galeno2026*;
-- si no está seguro de que siga vigente, cambie REEMPLAZAR_POR_CLAVE_SEGURA por una nueva.
CREATE USER IF NOT EXISTS 'galeno_api'@'%' IDENTIFIED BY 'REEMPLAZAR_POR_CLAVE_SEGURA';
GRANT SELECT, INSERT, UPDATE, DELETE ON farmacia_galeno.* TO 'galeno_api'@'%';
FLUSH PRIVILEGES;
-- IMPORTANTE: '%' permite conexiones desde cualquier IP que alcance el puerto. Restrinja la red con VirtualBox/firewall.
