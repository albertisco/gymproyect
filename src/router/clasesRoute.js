const express = require('express')
const claseDao = require('../db/dao/clasesDao')
const Clase = require('../models/claseModel').clase
const moment = require('moment')


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
    const semana = {
        year:moment().year(),
        numeroSemana: moment().week(),
        semana :{
            lunes: [clase],
            martes: [clase],
            miercoles:[clase],
            jueves:[clase],
            viernes:[clase],
            sabado:[clase]
        }
    }

    try {
        const auxsemana = await claseDao.guardarSemana(semana)
        resp.send(auxsemana)
    } catch (error) {
        resp.send(error)
    }

})
module.exports = router