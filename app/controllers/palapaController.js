const palapaModel = require('../models/palapaModel');

function buscarTodo(req, res){
    palapaModel.find({})
    .then(bebidas => {
        if (bebidas.length) {
            return res.status(200).send({bebidas})
        }
    return res.status(204).send({mensaje: "No hay nada que mostrar"})
})
.catch(error => {return res.status(404).send({mensaje: `Error al solicitar la información ${error}`})})
}

function agregar(req, res) {
    // console.log(req.body);
    new palapaModel(req.body).save()
    .then(info => {
        return res.status(200).send({mensaje: "La información se guardo con éxito", info})
    })
    .catch(e => {
        return res.status(404).send({mensaje: `Error al guardar la información ${e}`})
    })
}

function buscarBebida(req,res, next) {
    if (!req.body) req.body = {};
    let consulta = {};
    consulta[req.params.key] = req.params.value;
    console.log(consulta);
    palapaModel.find(consulta)
    .then(bebidas => {
        if (!bebidas.length) {
            return next()
        } 
        req.body.bebidas = bebidas;
        return next();
    })
    .catch(e => {
        req.body.e = e;
        return next();
    })
}

function mostrarBebida (req, res) {
    if(req.body.e){
        return res.status(404).send({mensaje: "Error al consultar la información"})
    }
    if (!req.body.bebidas) {
        return res.status(204).send({mensaje: "No se encontro información para mostrar"})
    }
    let bebidas = req.body.bebidas;
    return res.status(200).send({bebidas});
}

function eliminarBebida(req, res) {
    var bebidas = {};
    bebidas = req.body.bebidas;
    palapaModel.deleteOne(bebidas)
    .then(inf => {
        return res.status(200).send({message: "Bebida eliminada"})
    })
    .catch(e => {
        return res.status(404).send({message: "Error al eliminar la bebida", e})
    })

}

function actualizarBebida(req, res) {
    if (req.body.e) {
        return res.status(500).send({ message: "Error previo al actualizar", error: req.body.e });
    }

    if (!req.body.bebidas || !req.body.bebidas.length) {
        return res.status(404).send({ message: "No se encontró la bebida a actualizar" });
    }

    
    const bebidaEncontrada = req.body.bebidas[0];
    console.log(bebidaEncontrada);
    const filtro = { _id: bebidaEncontrada._id };

    const actualizacion = { ...req.body };
    delete actualizacion.bebidas;
    delete actualizacion.e;

    palapaModel.updateOne(filtro, { $set: actualizacion })
        .then(resultado => {
            if (resultado.modifiedCount === 0) {
                return res.status(200).send({ message: "No hubo cambios en la bebida" });
            }
            return res.status(200).send({ message: "Bebida actualizada correctamente" });
        })
        .catch(error => {
            return res.status(500).send({ message: "Error al actualizar la bebida", error });
        });
}


module.exports = {
    buscarTodo,
    agregar,
    buscarBebida,
    mostrarBebida,
    eliminarBebida,
    actualizarBebida
}