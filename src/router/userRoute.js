const express = require('express')
const usuarioDao = require('../db/dao/userDao')
const claseDao = require('../db/dao/clasesDao')
const util = require('../utils/util')
const { encontrarUsuarioReserva } = require('../utils/usuarioUtils')
const {comprobarCaducidadToken } = require('../midleware/userMidleware')
const moment = require('moment')



const router = express.Router()

//crear usuario - POST

router.post('/usuarios', async(req,resp) => {
    
    //obtenemos el usuario del body de la peticion http
    const usuario = req.body.usuario 
    try{
        //comprobamos si el nif o el email es correcto
        await usuarioDao.validarUsuarioByNiforEmail(usuario.nif,usuario.email)
        //guardamos al usuario
        const respuesta = await usuarioDao.insertarUsuario(usuario)
        //retornamos la response
        resp.send(respuesta)
    } catch (error) {
        //devolvemos el error
        resp.send(error)
    }
    
})

//Login usuario - POST

router.post('/usuarios/login', async (req,resp) => {
    //obtenemos las credenciales que viajen en el body de la request, en el objeto credenciales
    const {nif,pass} = req.body.credenciales 
    try {
        //comprobamos si el usuario existe
        const {status,usuario} = await usuarioDao.encontrarUsuarioByNif(nif)
        console.log(usuario)

        //comprobamos si la password que tenemso almacenada en bd es la misma que nos envian
        const coincide = await util.comprobarPassword(pass, usuario.password)
        console.log('coincide',coincide)
        //ssi la password no coincide enviamos un error
       if(!coincide){
            resp.send({
                status:400,
                Error:'Credenciales incorrectas, recuerde que a los tres intentos su usuario quedará bloqueado'
            })
            return
        }
        //obtenemos el jwt y lo metemos en la response para el usuario
         const jwt = await usuario.generarJwt()
         console.log('jwt', jwt);
         let inicio = "";
         //obtenemos el menú del usuario
         console.log('antes de obtener menu', usuario.tipoUsuario)
         const menu = await usuarioDao.obtenerMenuUsuario(usuario.tipoUsuario)
         console.log('despues de obtener menu usuario')
         console.log('menu',menu);
         if(usuario.tipoUsuario === "N"){
            inicio = "inicio"
         } else {
            inicio = "admin"
         }

         resp.send({
             status,
             jwt,
             inicio,
             menu
         })
        
    } catch(error) {
        // si se produce cualquier error no contemplado devolvemos un error 500
        resp.send({
            status:500,
            Error:'Vuelva a intentarlo más tarde, en caso de que el error persista contacto con nosotros'
        })
    }
})

//Ver perfil usuario - GET

router.get('/usuarios/me', comprobarCaducidadToken , async (req,resp) => {
    //en primer lugar ejecutamos el middleware que nos permite saber si el token del usuario está caducado
    //obtenemos de la request el idUsuario
    const idUsuario = req.caducidad.id
    try {
        //ejecutamos el método buscarUsuarioPorId que nos devuelve el usuario en función del Id
        const response = await usuarioDao.buscarUsuarioPorId(idUsuario)
        //devolvemos la respuesta
        resp.send(response)
    } catch(error) {
        //si se produce algún error se lanza un mensaje
        resp.send(error)
    } 
})

//Resetear pw  - POST

router.post('/usuarios/me/resetpassword', comprobarCaducidadToken, async (req,resp) => {

    try {

        const idUsuario = req.caducidad.id
        const {nuevapassword, passwordantigua} = req.body

        //buscamos y obtenemos el usuario por Id
        const {user} = await usuarioDao.buscarUsuarioPorId(idUsuario)
        if(!user){
            resp.send({
                status:400,
                error:'Usuario no existe'
            })
            return
        }

        //comprobamos si la password del usuario en bbdd coincide con la introducida
        console.log(nuevapassword,passwordantigua)
        const coincide = await util.comprobarPassword(passwordantigua,user.password)
        console.log(coincide)
        if(!coincide){
            resp.send({
                status:400,
                error:'password antigua incorrecta, vuelva a intentarlo'
            })
            return;
        }

        //encriptamos la pw
        const nuevapasswordencriptada = await util.encriptarPassword(nuevapassword)

        //seteamos la nuevapassword al usuario obtenido de la bbdd
        const {status,usuarioActualizado, error} = await usuarioDao.actualizarPassword(nuevapasswordencriptada,idUsuario) 
        //si existe el error devolvemos el error con su status correspondiente
        if(error){
            resp.send({
                status,
                error
            })
            return
        }

        resp.send({
            status,
            usuarioActualizado
        })

    
    } catch (error) {
        resp.send({
            status:500,
            error
        })
    }
})

//******** RESERVAR CLASES *********//

router.post('/usuarios/reservar/:idclase',  comprobarCaducidadToken, async (req,resp) => {

        const clase = req.params.idclase
        const idUsuario = req.caducidad.id
    try{

        console.log(clase)
        //buscamos la clase y la obtenemos
        const clasebd = await claseDao.obtenerClase(clase)

        console.log(clasebd)

        //buscamos la clase en la semana y el año en el que estamos
        //si no dá error, continuamos la ejecución, sino entra en el catch y devuelve el error
        await claseDao.buscarClaseSemana(clase,moment().week(), moment().year())

        console.log('semana encontrada')

        //obtenemos la fecha de la clase y la pasamos a un objeto moment
        const fechaClase = clasebd.fecha;
        const auxfecha = moment(new Date(fechaClase))


       //obtenemos el dia de la semana 0,1,2,3
       const diaclase = auxfecha.day()
       console.log('diclase',diaclase)
       if(diaclase < moment().day()) {
           resp.send({
               status:401,
               error:'No puede reservar una clase de un dia pasado'
           })
           return
       }
        //comprobamos que están en el mismo dia
       if(diaclase === moment().day()) {
           console.log('estan en el mismo dia')
           const horaclase = auxfecha.hour()
           const minutoclase = auxfecha.minute()
           console.log('hora',horaclase)
           console.log('minuto',minutoclase)
           console.log('hora actual', moment().hour())
           //comprobamos que si la clase está en el mismo dia no se pueda reservar pasada la hora
           if(horaclase < moment().hour()) {
               console.log('hora menor')
               resp.send({
                   status:401,
                   error:'No puede reservar una clase que ya ha sido realizada'
               })
               return
           }
           //comprobamos que la clase se encuentra en la misma hora y que sea inferior a 10 minutos ya que no se puede reservar
           if((horaclase === 17/*moment().hour()*/) && ((minutoclase - moment().minute()) < 10)){
            console.log('menos de 10 minutos para que empieze la clase')
                resp.send({
                    status:401,
                    error:'No se puede reservar una clase faltando menos de 10 minutos '
                })
                return
           }
       }

       //comprobamos que el usuario no esté bloqueado

        const respuesta = await usuarioDao.buscarUsuarioPorId(idUsuario)
        console.log(respuesta)
        const usuario = respuesta.user;
        console.log('usuario', usuario)
        if(usuario.bloqueado){
            console.log('usuario bloqueado')
            resp.send({
                status:404,
                error:'No puede reservar clases un usuario bloqueado'
            })
            return;
        }

        //comprobamos que un mismo usuario no pueda reservar la clase dos veces
        const alumnosInscritos = clasebd.alumnos
        console.log(alumnosInscritos)

       const hareservado =  alumnosInscritos.find((alumnoid) => {
            return alumnoid == idUsuario
        })
        console.log('hareservado',hareservado)
        if(hareservado){
            console.log('usuario reservado dos veces')
            resp.send({
                status:401,
                error:'No puedes reservar la misma clase'
            })
            return
        }

        if( clasebd.alumnosInscritos >= clasebd.maxAlumnos){
            console.log('clase llena')
            resp.send({
                status:401,
                error:'la clase que intenta reservar está llena'
            })
            return
        }
        //añadimos el id de la clase a la propiedas clasesReservada del usuario
        usuario.clasesReservadas.push(clase)
        const actualizadoClase = await usuarioDao.actualizarClasesUsuario(idUsuario,usuario.clasesReservadas)

        console.log(actualizadoClase)

        //añadimos el usuario al array de usuarios inscritos
        clasebd.alumnos.push(idUsuario)
        clasebd.alumnosInscritos += 1

        console.log('actualizada',clasebd)

        //actualizamos el documento en bbdd
        const respuestaActualizacion = await claseDao.reservarClase(clasebd, clasebd.alumnos, clasebd.alumnosInscritos)
        console.log(respuestaActualizacion)
 
        

        resp.send(respuestaActualizacion)


    } catch (error) {
        resp.send(error)
    }
})

router.get('/usuarios/reservas/historico', comprobarCaducidadToken, async (req,resp) => {

    const idUsuario = req.caducidad.id

    try{
        const historico = await usuarioDao.obtenerHistoricoClasesbyId(idUsuario)
        console.log(historico)
        resp.send({
            status:200,
            historico
        })
    } catch (error) {
        resp.send(error)
    }
})

router.post('/usuarios/reservas/cancelar/:idClase', comprobarCaducidadToken , async (req,resp) => {


    const idClase = req.params.idClase 
    const idUsario = req.caducidad.id

    try {
        //obtenemos la clase que se quiere reservar
        const clase = await claseDao.obtenerClase(idClase)


        //comprobamos que el usuario que haya reservado la clase
        if( !encontrarUsuarioReserva(clase.alumnos, idUsario) ){
            resp.send({
                status:401,
                error:'Error, no puede cancelar la clase'
            })
            return
        }
        
        //comprobamos que haya una diferencia mayor a 10 minutos para cancelar la clase

        const fechaClase = new Date(clase.fecha)
        const fechaActual = new Date()



        const diferencia = ((Math.round(fechaClase.getTime())/60000) - (Math.round(fechaActual.getTime())/60000))

        if(diferencia < 10) {
            resp.send({
                status:400,
                error: 'No puede cancelar la clase'
            })
            return
        }
        //borramos el alumno en la clase
        let alumnosActualizado = []
        if(clase.alumnos.length > 1){
            alumnosActualizado = clase.alumnos.splice(clase.alumnos.indexOf(idUsario),1)
        }
        //obtenemos el usuario para borrar la clase en su historico


        const { status , user } = await usuarioDao.buscarUsuarioPorId(idUsario)


        let historicoActualizado = []

        if(user.clasesReservadas.length > 1) {
            historicoActualizado = user.clasesReservadas.splice(user.clasesReservadas.indexOf(idClase),1)
        }


        //actualizamos el usuario y la clase

        const actualizacionUsuario = await usuarioDao.actualizarClasesUsuario(idUsario,historicoActualizado)
        const actualizacionClase = await claseDao.actualizarAlumnosClase(idClase,alumnosActualizado, clase.alumnosInscritos-1)

        //si ambas actualizaciones fallan
        if(!actualizacionUsuario && !actualizacionClase){
            resp.send({
                status:500,
                error:'Error al cancelar la clase'
            })
            return
        }
        //si falla al actualizar el usuario, hacemos rollback de la clase
        if(!actualizacionUsuario && actualizacionClase){
            await claseDao.actualizarAlumnosClase(idClase,clase.alumnos,clase.alumnosInscritos)
            resp.send({
                status:500,
                error:'Error al cancelar la clase'
            })
            return
        }
        //si falla al actualizar la clase, hacemos rollback del usuario
        if(!actualizacionClase && actualizacionUsuario){
            await usuarioDao.actualizarClasesUsuario(idUsario,usuriobd.clasesReservadas)
            resp.send({
                status:500,
                error:'Error al cancelar la clase'
            })
            return
        }
        //cancelacion de la clase con éxito
        resp.send({
            status:200,
            resp:'Clase cancelada con éxito'
        })
    } catch (e) {
        resp.send(e)
    }

})


module.exports = router

