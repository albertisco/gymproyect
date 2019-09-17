const Usuario = require('../dao/db/models/userModel')

module.exports.encontrarUsuarioByNiforEmail = async (nif,email) => {

    return new Promise((resolve,reject) => {      
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