CREATE DATABASE food_db OWNER bhsis;
CREATE DATABASE web_db OWNER bhsis;
CREATE DATABASE agro_db OWNER bhsis;
CREATE DATABASE saloes_db OWNER bhsis;
CREATE DATABASE clinicas_db OWNER bhsis;
CREATE DATABASE shop_db OWNER bhsis;
CREATE DATABASE pet_db OWNER bhsis;
CREATE DATABASE wms_db OWNER bhsis;
CREATE DATABASE oficinas_db OWNER bhsis;
CREATE DATABASE escolas_db OWNER bhsis;
CREATE DATABASE frota_db OWNER bhsis;
CREATE DATABASE varejo_db OWNER bhsis;
CREATE DATABASE igrejas_db OWNER bhsis;
CREATE DATABASE imobiliarias_db OWNER bhsis;

\connect auth_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect food_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect web_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect agro_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect saloes_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect clinicas_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect shop_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect pet_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect wms_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect oficinas_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect escolas_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect frota_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect varejo_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect igrejas_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;

\connect imobiliarias_db
CREATE SCHEMA IF NOT EXISTS bhsis AUTHORIZATION bhsis;
