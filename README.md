# Descripción

## Correr en dev

1. Clonar el repositorio
2. Crear una copia del archivo ```.env.template```, renombrarlo por ```.env``` y cambiar las variables de entorno
3. Instalar la depedencia ```npm install```
4. Levantar la base de datos ```docker compose up -d``` (Tener instalado Docker)
5. Correr las migraciones de Prisma ```npx prisma migrate dev```
6. Ejecutar el seed ```npm run seed``` o ```node --run seed``` para node.js ^22
7. Limpiar el localStorage del navegador
8. Correr el proyecto ```npm run dev``` o ```node --run dev``` para node.js ^22

## Correr en producción