const { response, request } = require("express");
const { Categoria } = require('../models')


// Obtener categorias - paginado - total - populate indicar informacion del usuario
const obtenerCategorias = async (req, res = response) => {

    const { limit, desde } = req.query;
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limit))
    ])

    res.json({
        total,
        categorias
    })
}

// Obtener categoria - populate - retornar objeto 

const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;

    //Obtener la categoria
    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre')

    if (!categoria) {
        return res.status(400).json({
            msg: `No se encontro la categoria con el id ${id}`
        })
    }

    res.status(200).json({
        categoria
    })
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre })

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
    }

    const categoria = new Categoria(data)

    // Guardar DB
    try {
        await categoria.save()
        res.status(201).json({
            categoria
        })
    } catch (error) {
        res.status(500).json({
            msg: `Ha ocurrido el error: ${error}`
        })
    }
}

// actualizar categoria

const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params
    const nombre = req.body.nombre.toUpperCase();
    const usuario = req.body.usuario._id

    const categoria = await Categoria.findByIdAndUpdate(id, {
        nombre: nombre,
        usuario: usuario

    })

    res.json({
        categoria
    })

}


// Borrar categoria - estado:false
const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params

    // New true para que devuelva el documento con los cambios actualizados
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json({
        categoria
    })
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}