const validaCampos = require('../middlewares/validar-campos');
const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validaCategoria = require('../middlewares/validar-categoria');
const validarArchivoSubir = require('./validar-archivo');



module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validaCategoria,
    ...validarArchivoSubir
}