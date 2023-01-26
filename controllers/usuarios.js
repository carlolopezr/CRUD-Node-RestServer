const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');




const usuariosGet = async (req = request, res = response) => {

    const { limit = 5, desde = 0 } = req.query
    const query = { estado: true }

    // const usuarios = await Usuario.find(query)
    // .skip(Number(desde))
    // .limit(Number(limit));

    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    // Instancia del usuario
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar contraseña
    // 10 por defecto
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)

    // Guardar el usuario en bd
    try {
        await usuario.save()
    } catch (error) {
        console.log(error + 'AQUI ESTA');
    }



    res.json({
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body

    // TODO validar contra base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt)
    }

    // Encuentra al usuario, lo actualiza y lo retorna

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params

    // Borrarlo fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id)

    // Cambiar el estado a inactivo
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })
    // const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}