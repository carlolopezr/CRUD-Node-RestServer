const { response } = require("express");
const { Producto, Categoria } = require("../models");


const obtenerProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;


    const [total, productos] = await Promise.all([
        Producto.countDocuments({ estado: true }),
        Producto.find({ estado: true })
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params
    const producto = await Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')

    if (!producto) {
        return res.status(400).json({
            msg: `No se encontro el producto con el id ${id}`
        })
    }

    res.json({
        producto
    })
}

const crearProducto = async (req, res = response) => {

    const { nombre, descripcion, precio, disponible, categoria } = req.body

    const producto = new Producto({
        nombre,
        usuario: req.usuario._id,
        precio,
        categoria: categoria,
        descripcion,
        disponible
    })

    try {
        await producto.save();
    } catch (error) {
        res.status(401).json({
            msg: `Ocurrio el error ${error}`
        })
    }

    res.json({
        producto
    })
}


const actualizarProducto = async (req, res = response) => {

    const { id } = req.params
    const { nombre, descripcion, precio, disponible, categoria } = req.body

    const data = {
        nombre,
        usuario: req.usuario._id,
        precio,
        categoria: categoria,
        descripcion,
        disponible
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true })

    res.json({
        producto
    })
}

const eliminarProducto = async (req = request, res = response) => {

    const { id } = req.params

    // New true para que devuelva el documento con los cambios actualizados
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json({
        producto
    })
}




module.exports = {
    obtenerProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
}