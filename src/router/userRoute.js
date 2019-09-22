const express = require('express')
const usuarioDao = require('../db/dao/userDao')
const util = require('../utils/util')
const userMiddleware = require('../midleware/userMidleware')


const router = express.Router()

//crear usuario - POST

router.post('/usuarios', async(req,resp) => {
    
    //obtenemos el usuario del body de la peticion http
    const usuario = req.body.usuario 
    try{
        //comprobamos si el nif o el email es correcto
        await usuarioDao.validarUsuarioByNiforEmail(usuario.nif,usuario.email)
        //guardamos al usuario
        const respuesta = await usuarioDao.insertarUsuario(usuario)
        //retornamos la response
        resp.send(respuesta)
    } catch (error) {
        //devolvemos el error
        resp.send(error)
    }
    
})

//Login usuario - POST

router.post('/usuarios/login', async (req,resp) => {
    //obtenemos las credenciales que viajen en el body de la request, en el objeto credenciales
    const credenciales = req.body.credenciales 
    try {
        //comprobamos si el usuario existe
        const response = await usuarioDao.encontrarUsuarioByNif(credenciales.nif)

        //comprobamos si la password que tenemso almacenada en bd es la misma que nos envian
        const coincide = await util.comprobarPassword(credenciales.pass, response.usuario.password)

        //si el usuario no existe o si la password no coincide enviamos un error
        if(!response.usuario || !coincide){
            resp.send({
                status:400,
                Error:'Credenciales incorrectas, recuerde que a los tres intentos su usuario quedará bloqueado'
            })
            return
        }
        //obtenemos el jwt y lo metemos en la response para el usuario
         const jwt = await response.usuario.generarJwt()
         response.jwt = jwt
         resp.send({
             response
         })
        
    } catch(error) {
        // si se produce cualquier error no contemplado devolvemos un error 500
        resp.send({
            status:500,
            Error:'Vuelva a intentarlo más tarde, en caso de que el error persista contacto con nosotros'
        })
    }
})


router.get('/usuarios/me', userMiddleware.comprobarCaducidadToken ,(req,resp) => {
    resp.send('ver perfil')
})
module.exports = router

