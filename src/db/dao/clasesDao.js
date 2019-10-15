const mongoose = require('mongoose')
const Semana = require('../../models/semanaModel').semana
const Clase = require('../../models/claseModel').clase

module.exports.guardarClase = (clase) => {
    return new Promise(async(resolve, reject) => {

        try {
            console.log('antes')
            const auxClase = new Clase(clase)
            console.log('despues',auxClase)
            const claseGuardada = auxClase.save()
            if(!claseGuardada){
                reject(false)
                return
            }

            resolve(true)
        } catch(error) {
            reject(false)
        }

    })
}

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

module.exports.obtenerSemana = (numeroSemana , year) => {

    return new Promise( async (resolve,reject) => {
        try{

            const auxSemana = await Semana.findOne({numeroSemana , year})
            .populate('semana.lunes')
            .populate('semana.martes')
            .populate('semana.miercoles')
            .populate('semana.jueves')
            .populate('semana.viernes')
            .populate('semana.sabado')
            if(!auxSemana){
                reject({
                    status:400,
                    error:'No existen los horarios para esa semana'
                })
                return
            }
            resolve({
                status:200,
                auxSemana
            })

        } catch(error) {
            reject({
                status:500,
                error:'Hubo un error, vuelva a intentarlo más tarde'
            })
        }
       


    })
}