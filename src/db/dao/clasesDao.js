const mongoose = require('mongoose')
const Semana = require('../../models/semanaModel').semana

//metodo para guardar una semana de clases
module.exports.guardarSemana = (semana) => {
    //pendiente de desarrollar funcionamiento básico

    return new Promise((resolve,reject) => {
            console.log('antes', semana)
        try {
            const auxSemana = new Semana(semana)

            console.log('despues', auxSemana)

            const resultado = auxSemana.save()

            resolve(resultado)
        } catch(error) {
            reject(error)
        }
    })
    
}