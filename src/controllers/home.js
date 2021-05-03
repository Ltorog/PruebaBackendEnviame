const { Client } = require('pg');
const winston = require('winston');
const faker = require('faker');
const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');
const consoleTransport = new winston.transports.Console()
const myWinstonOptions = {
    transports: [consoleTransport]
}
const inputConexion = require('../../credentials.json');


const REDISHOST = 'redis';
const REDISPORT = 6379;

const redisClient = redis.createClient(REDISPORT, REDISHOST);

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const expireAsync = promisify(redisClient.expire).bind(redisClient);


const conexionDb = async () => {
    try {
        const client = new Client(inputConexion);
        await client.connect();

        return client;
    }
    catch (err) {
        logger.error("Error al conectar db: " + err);
        return ;
    }
};

const logger = new winston.createLogger(myWinstonOptions);

const generarEmpresa = async (req, res) => {
    const client = await conexionDb();

    try {
        const input = req.body;
        const validate = await validateInput(input, false);

        if(validate.length > 0) {
            return res.status(422).send({ mensaje: "No se han ingresado correctamente los parametros", errors: validate });
        }

        const sql = 'INSERT INTO companies(name, city, number, email) VALUES ($1, $2, $3, $4)';
        const values = [input.name, input.city, input.number, input.email];

        await client.query(sql, values);

        logger.info("Se agrega a companies: " + sql);

        return res.status(201).send({ mensaje: "Empresa generada correctamente" });
    }
    catch (err) {
        return res.status(500).send({ mensaje: "Error al generar empresa", error: err })
    }
    finally {
        client.end();
    }
}

const obtenerEmpresas = async (req, res) => {
    const client = await conexionDb();

    try {

        let sql = 'SELECT * FROM companies';
        const values = [];

        if(req.query != undefined ? req.query.id != undefined : false) {
            sql += ' WHERE id = $1'
            values.push(req.query.id);
        }

        const response = await client.query(sql, values);

        logger.info("Se consulta a companies: " + sql);

        return res.status(200).send({ mensaje: "Consulta se ha realizado correctamente", data: response.rows });
    }
    catch (err){
        logger.error("Error al obtener: ", err);
        return res.status(500).send({ mensaje: "Error al obtener empresas", error: err })
    }
    finally{
        client.end();
    }
}

const eliminarEmpresas = async (req, res) => {
    const client = await conexionDb();

    try {
        console.log(req.query);
        if(req.query != undefined ? (req.query.id == undefined && typeof req.query.id != 'number') : true) {
            return res.status(422).send({ mensaje: "No se ha ingresado ID de empresa" })
        }

        const sql = 'DELETE FROM companies WHERE id = $1'
        const values = [req.query.id];
        await client.query(sql, values);

        logger.info("Se elimina company: " + sql);

        return res.status(200).send({ mensaje: "Empresa eliminada  correctamente" });
    }
    catch (err){
        logger.error("Error al eliminar: ", err);
        return res.status(500).send({ mensaje: "Error al eliminar empresa", error: err })
    }
    finally{
        client.end();
    }
}

const actualizarEmpresas = async (req, res) => {
    const client = await conexionDb();

    try {
        const input = req.body;
        const validate = await validateInput(input, true);

        if (validate.length > 0) {
            return res.status(422).send({ mensaje: "Debe enviar todos los parametros ", errors: validate });
        }

        const sql = "UPDATE companies SET name=$1, number=$2, city=$3, email=$4 WHERE id = $5"
        const values = [input.name, input.number, input.city, input.email, req.query.id];

        console.log(sql);
        console.log(values);

        await client.query(sql, values);

        logger.info("Se actualiza company: " + sql);

        return res.status(200).send({ mensaje: "Empresa actualizada correctamente" });
    }
    catch (err) {
        return res.status(500).send({ mensaje: "Error al actualizar company", error: err})
    }
    finally {
        client.end();
    }
}

const generarFake = async (req, res) => {
    const client = await conexionDb();

    const menorCantidadFake = 1;
    const mayorCantidadFake = 10;

    logger.info("Entrando al método generarFake");

    try {
        let cantidadTotalFakes = Math.round(Math.random() * (mayorCantidadFake - menorCantidadFake) + menorCantidadFake)

        console.log("   Datos fake a crear: " + cantidadTotalFakes);
        for (let i = 0; i < cantidadTotalFakes ; i++) {
            const randomName = faker.name.findName(); // Rowan Nikolaus
            const randomCity = faker.address.cityName(); // location
            const randomEmail = faker.internet.email()
            const randomNumber = faker.phone.phoneNumber();

            const sql = 'INSERT INTO companies(name, city, number, email) VALUES ($1, $2, $3, $4)';
            const values = [randomName, randomCity, randomNumber, randomEmail];

            await client.query(sql, values);

            logger.info("Se agrega a companies: " + sql);
        }

        logger.info("  Método crear realizado exitosamente");
        return res.status(201).send({ mensaje: "Datos Fake creados correctamentes!"});
    }
    catch(err) {
        logger.error("  Método ha fallado: " + err);
        return res.status(500).send({ mensaje: "Error al crear faker: " + err });
    }
    finally {
        client.end();
    }
}

const guardarDelivery = async (req, res) => {
    const client = await conexionDb();
    const url = 'https://stage.api.enviame.io/api/s2/v2/companies/401/deliveries';

    try {
        const response = await axios({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'api-key': 'ea670047974b650bbcba5dd759baf1ed',
            },
            data: {
                "shipping_order": {
                    "n_packages": "1",
                    "content_description": "ORDEN 255826267",
                    "imported_id": "255826267",
                    "order_price": "24509.0",
                    "weight": "0.98",
                    "volume": "1.0",
                    "type": "delivery"
                },
                "shipping_origin": {
                    "warehouse_code": "401"
                },
                "shipping_destination": {
                    "customer": {
                        "name": "Bernardita Tapia Riquelme",
                        "email": "b.tapia@outlook.com",
                        "phone": "977623070"
                    },
                    "delivery_address": {
                        "home_address": {
                            "place": "Puente Alto",
                            "full_address": "SAN HUGO 01324, Puente Alto, Puente Alto"
                        }
                    }
                },
                "carrier": {
                    "carrier_code": "blx",
                    "tracking_number": ""
                }
            }
        }).then(response => {
            return response.data.data;
        }).catch(error => {
            return {};
        });
        if (Object.keys(response).length != 0) {
            let sql = 'INSERT INTO deliveries(identifier, imported_id, tracking_number, status, customer, shipping_address, country, carrier, service, label, barcodes, deadline_at, created_at, updated_at, links) ';
            sql += 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)'
            const values = [
                response.identifier, 
                response.imported_id, 
                response.tracking_number,
                JSON.stringify(response.status),
                JSON.stringify(response.customer),
                JSON.stringify(response.shipping_address),
                response.country,
                response.carrier,
                response.service, 
                JSON.stringify(response.label), 
                response.barcodes, 
                response.deadline_at, 
                response.created_at, 
                response.updated_at, 
                JSON.stringify(response.links)
            ];

            await client.query(sql, values);

            return res.status(201).send({ message: "Datos guardados exitosamente", data: response});
        }
        
        return res.status(200).send({ message: "Error al recuperar data de la API"});

        
    }
    catch (e) {
        logger.error('Error al guardar el delivery');
        logger.error(e);
        return res.status(500).send({ mensaje: "Error al guardar delivery", errors: e.detail })
    }
    finally {
        client.end();
    }
}

const contarPalindromos = async (req, res) => {
    try {
        let frase = "afoolishconsistencyisthehobgoblinoflittlemindsadoredbylittlestatesmenandphilosophersanddivineswithconsistencyagreatsoulhassimplynothingtodohemayaswellconcernhimselfwithhisshadowonthewallspeakwhatyouthinknowinhardwordsandtomorrowspeakwhattomorrowthinksinhardwordsagainthoughitcontradicteverythingyousaidtodayahsoyoushallbesuretobemisunderstoodisitsobadthentobemisunderstoodpythagoraswasmisunderstoodandsocratesandjesusandlutherandcopernicusandgalileoandnewtonandeverypureandwisespiritthatevertookfleshtobegreatistobemisunderstood"
        let palindromos = [];

        for (let i = 0; i < frase.length; i++)
        {
            for (let j = frase.length ; j > i ; j--) {
                let fraseParcial = frase.substring(i, j);
                console.log(fraseParcial);

                if (fraseParcial.length > 1 && esPalindromo(fraseParcial))
                {
                    palindromos.push(fraseParcial);
                }
            }
        }

        return res.status(200).send({ mensaje: "Cantidad de palindromos encontrados: " + palindromos.length, data: palindromos });
    }
    catch (e) {
        console.error(e);
        return res.status(500).send({ mensaje: "Error al contar palindromos" });
    }
}

const esPalindromo = (frase) => {
  var re = /[\W_]/g;
  
  var lowRegStr = frase.toLowerCase().replace(re, '');
  var reverseStr = lowRegStr.split('').reverse().join(''); 

  return reverseStr === lowRegStr;
}

const divisorMilFibonnaci = async (req, res) => {
    await setAsync("serie_1", 1);
    await setAsync("serie_2", 2);
    await setAsync("serie_3", 3);
    await setAsync("serie_4", 5);
    await setAsync("serie_5", 8);

    let serieFibonnaci = 1;
    let cantidadDivisores = [];
    let numeroFibonnaci = 1;

    const cantidadDivisoresFinal = 1000;

    const primos = await obtenerPrimos();

    while (cantidadDivisores.length < cantidadDivisoresFinal) {
        console.log("Serie fibonnaci: " + serieFibonnaci);

        numeroFibonnaci = Number(await fibonnaci(Number(serieFibonnaci)));
        cantidadDivisores = await divisoresNumero(numeroFibonnaci, primos);

        console.log("   Numero de la serie: " + Number(numeroFibonnaci)); 
        console.log("   Cantidad divisores: " + cantidadDivisores.length); 
        serieFibonnaci++;
    }

    return res.status(200).send({ mensaje: "El primer numero con mas de " + cantidadDivisoresFinal + " divisores es: " + numeroFibonnaci});
}

const obtenerPrimos = async () => {
    const MAX_SIZE = 1000005;
    const primos = [];

    var esPrimo = Array(MAX_SIZE).fill(true);

    let p, i;

    for (p = 2; p * p < MAX_SIZE; p++) {
        if (esPrimo[p] == true) {
            for (i = p * p; i < MAX_SIZE; i += p) {
                esPrimo[i] = false;
            }

        }
    }

    for (p = 2; p < MAX_SIZE; p++){
        if (esPrimo[p]) {
            primos.push(p);
        }
    }

    return primos;
};

const divisoresNumero = async (numero, primos) => {
    if (numero == 0) {
        return [];
    }
    let divisores = [1, numero]

    if (primos.includes(numero)) {
        divisores.pop(numero);
    }

    primos.forEach(primo => {
        let primoToBigInt = Number(primo);

        if (numero % primoToBigInt == 0) {
            divisores.push(primoToBigInt);

            let exponentesNumeroPrimo = Number(Math.round(log(primoToBigInt, numero)));

            for (let i = 2 ; Number(i) < exponentesNumeroPrimo / 2 ; i++) {
                let secuenciaPrimo = Number(Math.pow(primo, i));
                if (numero % secuenciaPrimo == 0) {
                    divisores.push(secuenciaPrimo);
                }
            }
        }
    });

    return divisores.filter(function(item, pos) {
        return divisores.indexOf(item) == pos;
    });
    
}

function log(x, y) {
    return Math.log(Number(y)) / Math.log(Number(x));
  }

const fibonnaci = async (num) => {

    const keySerieFibonnaci = "serie_" + num;

    const getKey = await getAsync(keySerieFibonnaci);

    if (getKey !== null && !isNaN(getKey)) {
        return Number(getKey)
    }
    else {
        if (num <= 1) {
            return Number(await getAsync("serie_1"));
        }
            
        const result = Number(await getAsync("serie_" + (num - 1))) + Number(await getAsync("serie_" + (num - 2))); 

        if (!isNaN(result))
            await setAsync(keySerieFibonnaci, Number(result));

        return Number(result)
    }
}

const tiempoDeEnvio = async (req, res) => {
    try {
        let input = req.query;
        let errors = validateInputEnvios(input);

        if (input != undefined ? errors.length > 0 : true) {
            return res.status(423).send({ mensaje: "Se deben ingresar parametros", errors: errors });
        }

        const dias = calcularTiempoEnvio(input.distance);

        let mensaje = "El envio desde " + input.from + " hasta " + input.to + " llega ";

        console.log("Dias " + dias);
        switch (dias) {
            case 0:
                mensaje += "el mismo dia";
                break;
            case 1:
                mensaje += "en " + dias + " dia";
                break;
            default:
                mensaje += "en " + dias + " dias";
                break;
        }

        return res.status(200).send({ mensaje: mensaje});

    }
    catch(e){
        logger.error(e);
        return res.status(500).send({ mensaje: "Error al calcular distancia" })
    }
}

const tiempoDeEnvioFake = async (req, res) => {
    try {
        let input = req.query;

        if (input != undefined ? (input.cantidad == undefined || typeof input.cantidad != 'number' && input.cantidad == 0) : true) {
            return res.status(423).send({ mensaje: "Se deben ingresar parametros", errors: ["debe ingresar cantidad en params"] });
        }

        const totalEnviosFake = [];

        for (let i = 1 ; i <= input.cantidad ; i++) {
            const datosEnvio = {
                id: i,
                from: faker.address.cityName(),
                to: faker.address.cityName(),
                distance: parseInt(Math.random() * (2000))
            }

            totalEnviosFake.push(datosEnvio);
        }

        totalEnviosFake.forEach(envio => {
            const dias = calcularTiempoEnvio(envio.distance);

            let mensaje = "El envio desde " + envio.from + " hasta " + envio.to + " llega ";

            console.log("Dias " + dias);
            switch (dias) {
                case 0:
                    mensaje += "el mismo dia";
                    break;
                case 1:
                    mensaje += "en " + dias + " dia";
                    break;
                default:
                    mensaje += "en " + dias + " dias";
                    break;
            }

            envio.mensaje = mensaje;
        })

        return res.status(200).send({ mensaje: totalEnviosFake});

    }
    catch(e) {
        console.error(e);
        return res.status(500).send({ mensaje: "Error al calcular distancia" })
    }
}

const calcularTiempoEnvio = (kilometros) => {
    if(kilometros <= 100) {
        return 0;
    }
    if (kilometros <= 200 && kilometros > 100) {
        return 1;
    }
    else {
        return calcularTiempoEnvio(kilometros - 100) + calcularTiempoEnvio(kilometros - 200);
    }
}

const validateInputEnvios = (input) => {
    const errors = [];

    console.log(input.from);
    if (input.from != undefined ? input.from.length == 0 && typeof input.from != 'string' : true) {
        errors.push("Se necesita campo from");
    }

    if (input.to != undefined ? input.to.length == 0 && typeof input.to != 'string' : true) {
        errors.push("Se necesita campo to");
    }

    if (input.distance == undefined && typeof input.from != 'number') {
        errors.push("Se necesita campo distance");
    }

    return errors;
} 

const actualizarSueldoEmpleados = async (req, res) => {
    const client = await conexionDb();

    try {

        const sql = `drop table if exists continents_ajuste;

        select co.id, ((100::DECIMAL + co.anual_adjustment)/100::DECIMAL) as ajuste
        into temp table continents_ajuste
        from continents co;
        
        update employees
        set 
            salary = salary::DECIMAL * ca.ajuste
        from countries c
        inner join continents_ajuste ca on c.continent_id = ca.id
        where salary <= 5000 and c.id  = country_id;`

        await client.query(sql);

        return res.status(200).send({ mensaje: "Se ha actualizado los salarios segun reajuste" })
    }
    catch(e) {
        logger.error("Error al intentar actualizar");
        logger.error(e);
        return res.status(500).send({ mensaje: "Error al actualizar" });
    }
    finally {
        client.end();
    }
}

const validateInput = async (input, necesitaId) => {
    const errors = [];

	if (input != null && Object.keys(input).length != 0) {
        if (necesitaId ? (input.id != undefined ? typeof input.id != 'number' : false) : false) {
            errors.push("Se necesita campo id");
        }

        if (!validateEmail(input.email)) {
            errors.push("Campo email no es valido");
        }

        if(input.number != undefined ? input.number.length == 0 || typeof input.number != 'string' : true) {
            errors.push("Se necesita campo number");
        }

        if(input.name != undefined ? input.name.length == 0 || typeof input.name != 'string' : true) {
            errors.push("Se necesita campo name");
        }

        if(input.city != undefined ? input.city.length == 0 || typeof input.city != 'string' : true) {
            errors.push("Se necesita campo city");
        }
    }

    return errors;
}

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = {
    generarFake, 
    generarEmpresa, 
    obtenerEmpresas, 
    eliminarEmpresas, 
    actualizarEmpresas,
    guardarDelivery,
    divisorMilFibonnaci,
    tiempoDeEnvio,
    actualizarSueldoEmpleados,
    tiempoDeEnvioFake,
    contarPalindromos
}
