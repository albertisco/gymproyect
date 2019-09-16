const moongose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new moongose.Schema({
    nif:{
        type: String,
        unique:true,
        required:true
    },
    email:{
        type: String,
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
    sancionado:{
        type:Boolean,
        default:false
    },
    alta:{
       type:Boolean,
       default:true 
    }
})

userSchema.pre('save', async function(next){

    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

const usuario = moongose.model('usuario', userSchema)

module.exports = usuario