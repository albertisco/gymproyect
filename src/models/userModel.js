const moongose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const util = require('../utils/util')


const userSchema = new moongose.Schema({
    nif:{
        type: String,
        unique:true,
        required:true
    },
    email:{
        type: String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Not is a valid email')
            }
        }
    },
    
    password:{
        type:String,
        required:true
    }
    ,
    fecha_matriculacion:{
        type:Date,
        default(){
            return new Date()
        }
    },
    nombre:{
        type:String,
        required:true
    },
    apellidos:{
        type:String,
        required:true
    },
    faltas:{
        type:Number,
        default:0
    },
    alta:{
       type:Boolean,
       default:true 
    },
    bloqueado:{
        type:Boolean,
        default:false
    },
    jwt:{
        type:String,
        default:""
    },
    clasesReservadas:[
        {
            type:moongose.Schema.Types.ObjectId,
            ref:'clase'
        }
    ],
    tipoUsuario: {
        type: String,
        default:"N"
    }
        
})

userSchema.pre('save', async function(next){

    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})
//funcion para generarJwt
userSchema.method('generarJwt', async function () {

        const user = this
        //obtenemos el jwt
        const jwt =  util.encriptar(user._id)
        user.jwt = jwt
        //guardamos el usuario, con el flag a false , para que no haga validaciones el modelo
        await user.updateOne({jwt})
        //devolvemos el jwt
        return jwt;
})

userSchema.method('toJSON', function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.jwt
    delete userObject.alta
    delete userObject.sancionado

    return userObject

}, 
{
    virtuals:true
})

const usuario = moongose.model('usuario', userSchema)

module.exports = usuario