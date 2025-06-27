const mongoose = require('mongoose');
const CONFIG = require('./configuracion')

module.exports = {
    connection : null,
    connect : () => {
        if (this.connection) {
            return this.connection
        } else {
            return mongoose.connect(CONFIG.DB)
            .then(conn => {
                this.connection = conn;
                console.log('La conexión se realizo con éxito');
            })
            .catch(e => console.log('error en la conexión',e));
        }
    }
}