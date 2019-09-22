const util = require('../utils/util')


module.exports.comprobarCaducidadToken = async (req,resp,next) => {
    try{
        const token = req.get('Authorization').replace('Bearer ','')
        const caducidad = await util.verificarToken(token)
        next()
    } catch (error) {
        resp.send({
            status:401,
            error:'Vuelva a conectarse, sesión terminada'
        })
    }
}