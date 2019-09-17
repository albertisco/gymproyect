const express = require('express')
const usuarioDao = require('../db/dao/userDao')

const router = express.Router()

//crear usuario - POST

router.post('/usuarios', async(req,resp) => {
    
    //obtenemos el usuario del body de la peticion http
    const usuario = req.body.usuario

    try{
        //comprobamos si el nif o el email es correcto
        await usuarioDao.encontrarUsuarioByNiforEmail(usuario.nif,usuario.email)
        //guardamos al usuario

        //retornamos la response
    } catch (error) {
        //devolvemos el error
    }
    

 
})

//Login usuario - POST

