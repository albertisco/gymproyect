//zona de imports
//inicializamos express
const express = require('express')
require('./src/db/startConnection')

//inicializamos la aplicacion
const app = express()

//levantamos la aplicacion en el puerto 3000
app.listen(3000,() => {
    console.log('aplicacion inicializada')
})