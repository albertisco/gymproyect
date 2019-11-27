const util = require('../utils/util')
const usuarioDao = require('../db/dao/userDao')


module.exports.comprobarCaducidadToken = async (req,resp,next) => {
    try{
        console.log('token',req.get('Authorization'))
        const token = req.get('Authorization').replace('Bearer ','')
        const caducidad = await util.verificarToken(token)
        req.caducidad = caducidad
        next()
    } catch (error) {
        resp.send({
            status:401,
            error:'Vuelva a conectarse, sesión terminada'
        })
    }
}

module.exports.esAdmin = async (req,resp,next) => {

    try{
        const token = req.get('Authorization').replace('Bearer ','')
        const caducidad = await util.verificarToken(token)
        const {status, user} = await usuarioDao.buscarUsuarioPorId(caducidad.id)
        console.log('esadmin', user)
        user.tipoUsuario === "A" ? next(): resp.send({status:405,error:'vuelva a loguearse de nuevo'})
    } catch (error) {
        resp.send(error)
    }
}