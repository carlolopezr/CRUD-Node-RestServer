const { Categoria } = require("../models");


const esCategoriaValida = async (req, res, next) => {

    if (!req.body.categoria) {
        return res.status(401).json({
            msg: 'La categoria es obligatoria'
        })
    }

    const nombre = req.body.categoria.toUpperCase();

    const existeCategoria = await Categoria.findOne({ nombre })

    if (!existeCategoria || !existeCategoria.estado) {
        return res.status(401).json({
            msg: `No existe la categoria ${nombre} en la base de datos`
        })
    }

    req.body.categoria = existeCategoria._id
    next()
}

module.exports = {
    esCategoriaValida
}