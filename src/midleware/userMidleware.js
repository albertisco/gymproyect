const util = require('../utils/util')


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