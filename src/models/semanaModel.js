const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const semanaSchema = mongoose.Schema({
    year: {
        type: Number
    },
    numeroSemana:{
        type: Number
    },
    semana:{
        type:Map,
        of:[{type:ObjectId,ref:'clase'}]
    }
})

module.exports.semana  = mongoose.model('semana',semanaSchema)