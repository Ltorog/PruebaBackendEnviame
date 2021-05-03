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
    tiempoDeEnvio,
    actualizarSueldoEmpleados,
    tiempoDeEnvioFake,
    contarPalindromos } = require('../controllers/home'); 

const inicioRuta = '/api/v1/';

// Rutas al metodo del controlador
router.get(inicioRuta + generarFake.name, generarFake);
router.post(inicioRuta + generarEmpresa.name, generarEmpresa);
router.get(inicioRuta + obtenerEmpresas.name, obtenerEmpresas);
router.delete(inicioRuta + eliminarEmpresas.name, eliminarEmpresas);
router.put(inicioRuta + actualizarEmpresas.name, actualizarEmpresas);
router.post(inicioRuta + guardarDelivery.name, guardarDelivery);
router.get(inicioRuta + divisorMilFibonnaci.name, divisorMilFibonnaci);
router.get(inicioRuta + tiempoDeEnvio.name, tiempoDeEnvio);
router.get(inicioRuta + actualizarSueldoEmpleados.name, actualizarSueldoEmpleados);
router.get(inicioRuta + tiempoDeEnvioFake.name, tiempoDeEnvioFake);
router.get(inicioRuta + contarPalindromos.name, contarPalindromos);

module.exports = router;