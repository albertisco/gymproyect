const mongoose = require('mongoose')
const Semana = require('../../models/semanaModel')

//metodo para guardar una semana de clases
module.exports.guardarSemana = (semana) => {
    //pendiente de desarrollar funcionamiento básico

    return new Promise((resolve,reject) => {

        try {
            const auxSemana = new Semana(semana)

            const resultado = auxSemana.save()

            resolve(resultado)
        } catch(error) {
            reject(error)
        }
    })
    
}