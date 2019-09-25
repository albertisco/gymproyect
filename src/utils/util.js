const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//generamos el jwt
module.exports.encriptar = (id) => {
    return jwt.sign({id},'HalaMadrid', {expiresIn:3600})
}

module.exports.comprobarPassword = async(pwinsertada,pwdb) => {
    console.log(pwinsertada)
    console.log(pwdb)
    const existe = await bcrypt.compare(pwinsertada,pwdb)
    return existe
}

module.exports.encriptarPassword = async (nuevapassword) => {
    return await bcrypt.hash(nuevapassword,8)
}

module.exports.verificarToken = (jwtoken) => {
    const result = jwt.verify(jwtoken,'HalaMadrid',{maxAge:1800})
    return result
}