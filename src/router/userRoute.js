const express = require('express')
const usuarioDao = require('../db/dao/userDao')
const util = require('../utils/util')
const {comprobarCaducidadToken} = require('../midleware/userMidleware')



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
    const {nif,pass} = req.body.credenciales 
    try {
        //comprobamos si el usuario existe
        const {status,usuario} = await usuarioDao.encontrarUsuarioByNif(nif)

        //comprobamos si la password que tenemso almacenada en bd es la misma que nos envian
        const coincide = await util.comprobarPassword(pass, usuario.password)
        console.log(coincide)

        //ssi la password no coincide enviamos un error
       if(!coincide){
            resp.send({
                status:400,
                Error:'Credenciales incorrectas, recuerde que a los tres intentos su usuario quedará bloqueado'
            })
            return
        }
        //obtenemos el jwt y lo metemos en la response para el usuario
         const jwt = await usuario.generarJwt()
         resp.send({
             status,
             usuario,
             jwt
         })
        
    } catch(error) {
        // si se produce cualquier error no contemplado devolvemos un error 500
        console.log(error)
        resp.send({
            status:500,
            Error:'Vuelva a intentarlo más tarde, en caso de que el error persista contacto con nosotros'
        })
    }
})

//Ver perfil usuario - GET

router.get('/usuarios/me', comprobarCaducidadToken , async (req,resp) => {
    //en primer lugar ejecutamos el middleware que nos permite saber si el token del usuario está caducado
    //obtenemos de la request el idUsuario
    const idUsuario = req.caducidad.id
    try {
        //ejecutamos el método buscarUsuarioPorId que nos devuelve el usuario en función del Id
        const response = await usuarioDao.buscarUsuarioPorId(idUsuario)
        //devolvemos la respuesta
        resp.send(response)
    } catch(error) {
        //si se produce algún error se lanza un mensaje
        resp.send(error)
    } 
})

router.post('/usuarios/me/resetpassword', comprobarCaducidadToken, async (req,resp) => {

    try {

        const idUsuario = req.caducidad.id
        const {nuevapassword, passwordantigua} = req.body

        //buscamos y obtenemos el usuario por Id
        const {user} = await usuarioDao.buscarUsuarioPorId(idUsuario)
        if(!user){
            resp.send({
                status:400,
                error:'Usuario no existe'
            })
            return
        }

        //comprobamos si la password del usuario en bbdd coincide con la introducida
        const coincide = await util.comprobarPassword(passwordantigua,user.password)

        if(!coincide){
            console.log(3)
            resp.send({
                status:400,
                error:'password antigua incorrecta, vuelva a intentarlo'
            })
            return;
        }

        //encriptamos la pw
        const nuevapasswordencriptada = await util.encriptarPassword(nuevapassword)

        //seteamos la nuevapassword al usuario obtenido de la bbdd
        const {status,usuarioActualizado, error} = await usuarioDao.actualizarPassword(nuevapasswordencriptada,idUsuario) 
        //si existe el error devolvemos el error con su status correspondiente
        if(error){
            resp.send({
                status,
                error
            })
            return
        }

        resp.send({
            status,
            usuarioActualizado
        })

    
    } catch (error) {
        resp.send({
            status:500,
            error
        })
    }
})
module.exports = router

