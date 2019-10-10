const express = require('express')
const semana = require('../models/semanaModel')

const router = express.Router()

router.post('/clases', (req,resp) => {

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

})