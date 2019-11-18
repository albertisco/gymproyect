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

module.exports.obtenerClase = (idClase) => {

    return new Promise(async (resolve,reject) => {

        try{
            const clase = await Clase.findById(idClase)
            if(!clase){
                reject({
                    status:404,
                    error:'La clase no existe'
                })
                return
            }
            resolve(clase)
        } catch(error) {
            reject({
                status:500,
                error:'Hubo un error, vuelva a intentarlo más tarde'
            })
        }
    })
}

module.exports.buscarClaseSemana = (idClase,numeroSemana,year) => {

        return new Promise(async (resolve,reject) => {
            try {
                console.log(numeroSemana, year, idClase)
                const AuxSemana = await Semana.findOne({numeroSemana, year})
                                    .select('semana').exec()

                console.log(AuxSemana.semana)
                AuxSemana.semana.forEach((valor,clave) => {
                console.log('clave',clave)
                   const clases =  AuxSemana.semana.get(clave)
                   console.log(clases)
                   const resultado = clases.find((clase) => {
                       console.log('clase', clase)
                       return clase == idClase
                   })
                   console.log('resultado',resultado)
                   if(resultado){
                       console.log('resultado',resultado)
                       resolve()
                       return
                   }
                })
                reject({
                    status:404,
                    error:'La clase que se intenta reservaLa clase que se intenta reservar no existe'
                })
            } catch(error) {
                reject({
                    status:500,
                    error:'Hubo un error al reservar la clase, vuelva a intentarlo más tarde'
                })
            }
        })
}

module.exports.reservarClase = (clase, alumnos, alumnosInscritos) => {

    return new Promise(async (resolve,reject) => {

        try {
            console.log(clase.id)
            console.log(clase)
            
            const resultado = await Clase.findByIdAndUpdate({_id:clase._id}, {alumnos:alumnos, alumnosInscritos: alumnosInscritos} , {new:true})
            console.log(resultado)
            if(resultado.nModified <= 0) {
                reject({
                    status:401,
                    error:'Hubo un error al reservar la clase'
                })
                return
            }

            resolve({
                status:200,
                descripcion:'clase reservada'
            })
        } catch (error) {
            reject({
                status:500,
                error:'Error, vuelva a intentarlo más tarde'
            })
        }
    })

}

module.exports.actualizarAlumnosClase = (idClase, alumnosNuevo, inscritos) => {
    
    return new Promise(async(resolve,reject) => {
        console.log('actualizando')
        console.log('inscritos',inscritos)
        try {
            const resultado = await Clase.findByIdAndUpdate({_id:idClase}, {alumnos: alumnosNuevo, alumnosInscritos:inscritos})
            if(resultado.nModified < 0) {
                resolve(false)
                return
            }
            resolve(true)
        } catch(e) {
            resolve(false)
        }

    })
}