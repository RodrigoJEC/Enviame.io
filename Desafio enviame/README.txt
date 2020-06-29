PASO 1
Crear base de datos con

CREATE DATABASE EviameIO;

CREATE TABLE envios (
	id SERIAL PRIMARY KEY,
	registro json NOT NULL,
	distancia int
);


PASO 2
abrir terminal en carpeta REST-api

PASO 3
Ejecutar comandos

npm install
node src/index.js

PASO 4

El archivo Enviame.io.postman-collection.json contiene las peticiones HTTP REST necesarias para probar todas las funciones
en particular el formulario para realizar el cambio de un registro.