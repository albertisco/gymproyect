const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//generamos el jwt
module.exports.encriptar = (id) => {
    return jwt.sign({id},'HalaMadrid', {expiresIn:60})
}

module.exports.comprobarPassword = async(pwinsertada,pwdb) => {
    const existe = await bcrypt.compare(pwinsertada,pwdb)
    return existe
}

module.exports.verificarToken = (jwtoken) => {
    const result = jwt.verify(jwtoken,'HalaMadrid',{maxAge:30})
    return result
}