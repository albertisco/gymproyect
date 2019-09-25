const Usuario = require('../../models/userModel')

module.exports.validarUsuarioByNiforEmail = (nif,email) => {

    return new Promise( async (resolve,reject) => {      
        try{
            //buscamos si el nif o el email ya existen en bbdd
            const coincidencia = await Usuario.findOne()
                                        .or([{nif},{email}])
                                        .exec()

            //comprobamos si existe
            if(coincidencia){
                //si existe, comprobamos si el nif coincide con el introducido y retornamos el error
                if(coincidencia.nif === nif){
                    reject({
                        status:400,
                        error:'El nif del usuario ya existe en bbdd'
                    })
                } //si existe, comprobamos si el email coincide con el introducido y retornamos el error
                else if (coincidencia.email === email){
                    reject({
                        status:400,
                        error:'El email introducido ya existe en bbdd'
                    })
                }
                return;
            }
            //si no existe ni el nif ni el email , devolvemos un status 200
            resolve({status:200})
            
        } catch (error){
            //si se produce un error no controlado lanzamos un error 500
            reject({
                status:500,
                error:'Hubo un error, vuelva a intentarlo más tarde'
            })
        }
    })

}

module.exports.encontrarUsuarioByNif = (nif) => {

    return new Promise(async(resolve,reject) => {
        try{
            const usuario = await Usuario.findOne({nif})
            if(!usuario){
                reject({
                    status:400,
                    error:'Usuario no encontrado'
                })
                return;
            }
            resolve({
                status:200,
                usuario
            })
        } catch (error) {
            reject({
                status:500,
                error:'Hubo un error, vuelva a intentarlo más tarde'
            })
        }
    })
}


module.exports.insertarUsuario = (usuario) => {

    return new Promise( async (resolve,reject) => {
        try {
            const usuarioaux = new Usuario(usuario)
            //guardamos al usuario
            const usuarioinsertado = await usuarioaux.save()
            //generamos el jwt, actualizamos el usuario en bbdd con el jwt generado
            const jwt = await usuarioinsertado.generarJwt()
            //devolvemos la respuesta con el jwt
            resolve({
                status:200,
                usuarioinsertado,
                jwt
            })

        } catch (error) {
            reject({
                status:500,
                error:'Ocurrió un problema, vuelva a intentarlo más tarde'
            })
        }
    })
}

//metodo que nos permite buscarUsuarioPorId - se le pasa como parametro el id del usuario - devuelve una promesa
module.exports.buscarUsuarioPorId = (id) => {
    return new Promise(async(resolve,reject) => {              
        try{
            //obtenemos el usuario mediante la id facilitada
            const user = await Usuario.findById(id)
            //comprobamos que el usuario exista
            if(!user){
                //sino existe enviamos la response
                reject({
                    status:400,
                    error:'Usuario, no existe'
                })
                return
            }
            //si llega hasta aqui es por que el usuario existe, devolvemos la response
            resolve({
                status:200,
                user
            })
        } catch (error) {
            //si se produce un error no controlado, enviamos error
            reject({
                status:500,
                error:'Hubo un error, vuelva a intentarlo más tarde'
            })
        }
    })
}

module.exports.actualizarPassword = (nuevapassword, id) => {
    return new Promise( async (resolve,reject) => {
        try {
            const usuarioActualizado = await Usuario.updateOne({_id:id,password:nuevapassword})

            if(!usuarioActualizado){
                reject({
                    status:400,
                    error:'Error al actualizar el usuario'
                })
                return;
            }

            resolve({
                status:200,
                usuarioActualizado
            })
        } catch (error) {
            reject({
                status:500,
                error:'Error, vuelva a intentarlo más tarde'
            })
        }
    })
}