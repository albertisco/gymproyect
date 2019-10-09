const mongoose = require('mongoose')

const claseSchema = new mongoose.Schema({
    titulo:{
        type:String,
        required:true
    },
    duracion:{
        type: String,
        required:true
    },
    maxAlumnos:{
        type:Number,
        required:true
    },
    alumnosInscritos:{
        type:Number,
        default:0
    },
    hora:{
        type:String,
        required:true
    },
    sala:{
        type:String,
        required:true
    }
})

module.exports.clase = mongoose.model('clase',claseSchema)