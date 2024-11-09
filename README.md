# Descripción

## Correr en dev

1. Clonar el repositorio
2. Crear una copia del archivo ```.env.template```, renombrarlo por ```.env``` y cambiar las variables de entorno
3. Instalar la depedencia ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Correr las migraciones de Prisma ```npx prisma migrate dev```
6. Correr el proyecto ```npm run dev``` o ```node --run dev``` para node.js ^22

## Correr en producción