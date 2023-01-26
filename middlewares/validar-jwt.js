const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const usuario = await Usuario.findById(uid)

        // Verificar si existe el usuario
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - el usuario no existe'
            })
        }

        // Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado inactivo'
            })
        }



        req.usuario = usuario

        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'token no válido'
        })
    }


}


module.exports = {
    validarJWT
}