const moongose = require('mongoose')

moongose.connect('mongodb://127.0.0.1:27017/gym', 
                {
                    useNewUrlParser:true,
                    useCreateIndex:true,
                    useUnifiedTopology:true
                })
        .then(result => console.log('conectado a base de datos'))
        .catch(error => console.log('error al conectar la base de datos'))