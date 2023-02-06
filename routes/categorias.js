const { Router } = require('express');
const { body, check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares')

const router = Router();


// Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

// Obtener una categoria por id
router.get('/:id', [
    check('id', `el id no es un mongoId válido`).isMongoId(),
    //existeCategoria --> validar el id
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria)

// Crear categoria - privado - cualquiera con token
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actualizar - privado - cualquiera con token
router.put('/:id', [
    validarJWT,
    check('id', `el id no es un mongoId válido`).isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria)

// Borrar categoria - Admin
router.delete('/:id', [
    validarJWT,
    check('id', `el id no es un mongoId válido`).isMongoId(),
    check('id').custom(existeCategoria),
    esAdminRole,
    validarCampos
], borrarCategoria)


module.exports = router