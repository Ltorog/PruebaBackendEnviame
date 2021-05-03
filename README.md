# Prueba Backend Enviame

El proyecto esta realizado completamente en una API con NodeJS + Express, montado en una BD Postgres y apoyado por Redis, para lograr una optimizacion de algunos procesos. Siendo ya dichas las caracteristicas principales, cabe destacar que se encuentra todo dockerizado.

Para levantar el proyecto, se requiere el siguiente comando:

- docker-compose up -d --build

Con esto, se requiere verificar si la base se levanto, en caso de no realizarse, se solicita ejecutar el script del proyecto (init_database.sql), esto debido a que docker me presenta algunos problemas al iniciar este comando de vez en cuando, se cree que es por la version.

Finalmente, para probar cada punto de la prueba, se adjunta un archivo que se refiere a la ejecucion de cada endpoint (PruebaBackendToroGomez.postman_collection.json)