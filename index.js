//zona de imports
//inicializamos express
const express = require('express')
const cors = require('cors')
//conectamos con la bbdd
require('./src/db/startConnection')

//inicializamos la aplicacion
const app = express()
app.use(cors())

const userRoute =  require('./src/router/userRoute')
const clasesRoute = require('./src/router/clasesRoute')

app.use(express.json())
app.use(userRoute)
app.use(clasesRoute)

//levantamos la aplicacion en el puerto 3000
app.listen(3000,() => {
    console.log('aplicacion inicializada')
})