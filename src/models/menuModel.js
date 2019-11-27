const moongose = require('mongoose')

const menuSchema = new moongose.Schema({
    usuario: {
        type:String
    },
    menu: {
        type: Map,
        of: Object
    }
})

const menu = moongose.model("menu",menuSchema);
module.exports = menu; 