const jwt = require('jsonwebtoken')

//generamos el jwt
module.exports.encriptar = (id) => {
    return jwt.sign({id},'HalaMadrid')
}