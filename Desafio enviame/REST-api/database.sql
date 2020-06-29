CREATE DATABASE EviameIO;

CREATE TABLE envios (
	id SERIAL PRIMARY KEY,
	registro json NOT NULL,
	distancia int
);
/*
UPDATE envios Set distancia = Round(((100000) * Random()) + 1)
*/


