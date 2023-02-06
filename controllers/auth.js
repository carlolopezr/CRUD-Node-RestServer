const { response, request } = require("express");
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        //Verificar si el correo esta activo
        if (usuario.estado == false) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado'
            })
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body


    try {

        const { nombre, img, correo } = await googleVerify(id_token);
        console.log(correo);

        let usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            // crear usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            }

            usuario = new Usuario(data)

            await usuario.save();
        }

        // Verificar usuario activo
        if (!usuario.estado) {
            res.status(401).json({
                msg: 'Usuario inactivo'
            })
        }

        // generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        })
    }



}



module.exports = {
    login,
    googleSignIn
}