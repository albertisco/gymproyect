const express = require('express')
const {guardarSemana, guardarClase, obtenerSemana} = require('../db/dao/clasesDao')
const Clase = require('../models/claseModel').clase
const moment = require('moment')
const  {comprobarCaducidadToken} = require('../midleware/userMidleware')


const router = express.Router()

router.post('/clases', async (req,resp) => {

    const auxclase = {
        titulo:'Spinnig',
        duracion: '1 h',
        maxAlumnos:20,
        hora:'13:00',
        sala:'ciclo indoor'
    }
    const clase =  new Clase(auxclase)

    const resultado = await guardarClase(clase)
    if(!resultado){
        resp.send({
            status:500,
            error:'No se pudo guardar la clase'
        })
        return;
    }
    const semana = {
        year:moment().year(),
        numeroSemana: moment().week(),
        semana :{
            lunes: [clase,clase],
            martes: [clase,clase],
            miercoles:[clase,clase],
            jueves:[clase,clase],
            viernes:[clase,clase],
            sabado:[clase,clase]
        }
    }

    try {
        const auxsemana = await guardarSemana(semana)
        resp.send(auxsemana)
    } catch (error) {
        resp.send(error)
    }

})

router.get('/clases', comprobarCaducidadToken , async (req,resp) => {

    try {

        const respuestaSemana = await obtenerSemana(42,2019)
        resp.send(respuestaSemana)
    } catch(error) {
        resp.send(error)
    }
})
module.exports = router