const { response } = require("express");
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");



const cargarArchivo = async (req, res = response) => {

    // if (!req.files.archivo) {
    //     return res.status(400).json({
    //         msg: 'No hay archivos en la petición'
    //     });
    // }

    const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs');

    res.json({
        nombre: nombreArchivo
    })
}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un usuario con ese id'
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un producto con ese id'
                })
            }
            break;
        default:
            return res.status(500).json('Se me olvido validar esto')
    }

    // Limpiar imagenes previas
    try {
        // Verificar si la propiedad img existe en el modelo
        if (modelo.img) {
            // Borrar la img del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen)
            }
        }
    } catch (error) {
        res.status(400).json({
            msg: `Ha ocurrido el error: ${error}`
        })
    }

    const imagen = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = imagen;

    await modelo.save();
    res.json({
        modelo
    })
}

const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un usuario con ese id'
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un producto con ese id'
                })
            }
            break;
        default:
            return res.status(500).json('Se me olvido validar esto')
    }

    // Limpiar imagenes previas
    try {
        // Verificar si la propiedad img existe en el modelo
        if (modelo.img) {
            // Borrar la img del servidor
            console.log(modelo.img);
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1]
            console.log(nombre);
            const [public_id] = nombre.split('.')

            cloudinary.uploader.destroy(public_id)
        }
    } catch (error) {
        return res.status(400).json({
            msg: `Ha ocurrido el error: ${error}`
        })
    }

    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    await modelo.save();

    res.json({
        modelo
    })
}


const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un usuario con ese id'
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un producto con ese id'
                })
            }
            break;
        default:
            return res.status(500).json('Se me olvido validar esto')
    }

    let pathImagen = ''

    // Limpiar imagenes previas
    try {
        // Verificar si la propiedad img existe en el modelo
        if (modelo.img) {
            // Borrar la img del servidor
            pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen)
            }
        }
    } catch (error) {
        res.status(400).json({
            msg: `Ha ocurrido el error: ${error}`
        })
    }

    pathImagen = path.join(__dirname, '../assets/no-image.jpg')
    return res.sendFile(pathImagen)
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}