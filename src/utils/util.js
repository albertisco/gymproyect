const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//generamos el jwt
module.exports.encriptar = (id) => {
    return jwt.sign({id},'HalaMadrid')
}

module.exports.comprobarPassword = async(pwinsertada,pwdb) => {
    const existe = await bcrypt.compare(pwinsertada,pwdb)
    return existe
}