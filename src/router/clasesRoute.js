const express = require('express')
const claseDao = require('../db/dao/clasesDao')
const router = express.Router()

router.post('/clases', async (req,resp) => {

    const semana = {
        'lunes': [
            {
                titulo:'Spinnig',
                duracion: '1 h',
                maxAlumnos:20,
                hora:'13:00',
                sala:'ciclo indoor'
            }
        ],
        'martes': [
            {
                titulo:'Spinnig',
                duracion: '1 h',
                maxAlumnos:20,
                hora:'13:00',
                sala:'ciclo indoor'
            }
        ],
        'miercoles': [
            {
                titulo:'Spinnig',
                duracion: '1 h',
                maxAlumnos:20,
                hora:'13:00',
                sala:'ciclo indoor'
            }
        ],
        'jueves': [
            {
                titulo:'Spinnig',
                duracion: '1 h',
                maxAlumnos:20,
                hora:'13:00',
                sala:'ciclo indoor'
            }
        ],
        'viernes': [
            {
                titulo:'Spinnig',
                duracion: '1 h',
                maxAlumnos:20,
                hora:'13:00',
                sala:'ciclo indoor'
            }
        ],
        'sabado': [
            {
                titulo:'Spinnig',
                duracion: '1 h',
                maxAlumnos:20,
                hora:'13:00',
                sala:'ciclo indoor'
            }
        ]
    }

    try {
        const semana = await claseDao.guardarSemana(semana)
        resp.send(semana)
    } catch (error) {
        resp.send(error)
    }

})