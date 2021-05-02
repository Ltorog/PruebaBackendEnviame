const express = require('express');
const fs = require('fs');
const { Client } = require('pg');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const inputConexion = require('../../credentials.json');

const port = 3000;

// Extended: swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Prueba Enviame',
            description: 'Este portal de prueba enviame',
            contact: {
                name: 'Luis Toro'
            },
            server: ["http://localhost:3000"]
        }
    },
    apis: ["src/routes/*.js"]
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Validación de CORS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// rutas
app.use(require('./routes/home'));


//Metodo que inicializa la BD
const conexionDb = async () => {
    try {
        const client = new Client(inputConexion);
        await client.connect();

        return client;
    }
    catch (err) {
        console.error("Error al conectar db: " + err);
        return ;
    }
};

const inicializarBaseDeDatos = async () => {
    try {
        const client = await conexionDb();

        const sql = fs.readFileSync('init_database.sql').toString();   
        await client.query(sql);

        return true;
    }
    catch {
        return false;
    }
}

//Se levanta el servidor en el puerto especificado
app.listen(port, () => {
    console.log('Server levantado en puerto: ' + port);
});


