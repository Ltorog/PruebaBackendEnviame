const { Router } = require('express');
const router = Router();
const express = require('express');

const { 
    generarFake, 
    generarEmpresa, 
    obtenerEmpresas, 
    eliminarEmpresas,
    actualizarEmpresas,
    guardarDelivery,
    divisorMilFibonnaci,
    tiempoDeEnvio } = require('../controllers/home'); 


//Generacion de datos Fake
router.get('/api/v1/' + generarFake.name, generarFake);
router.post('/api/v1/' + generarEmpresa.name, generarEmpresa);
router.get('/api/v1/' + obtenerEmpresas.name, obtenerEmpresas);
router.delete('/api/v1/' + eliminarEmpresas.name, eliminarEmpresas);
router.put('/api/v1/' + actualizarEmpresas.name, actualizarEmpresas);
router.post('/api/v1/' + guardarDelivery.name, guardarDelivery);
router.get('/api/v1/' + divisorMilFibonnaci.name, divisorMilFibonnaci);
router.get('/api/v1/' + tiempoDeEnvio.name, tiempoDeEnvio);

module.exports = router;