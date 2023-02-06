const { Router } = require("express");
const { check } = require("express-validator");
const { obtenerProductos, crearProducto, obtenerProducto, actualizarProducto, eliminarProducto } = require("../controllers/productos");
const { existeProducto } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esCategoriaValida, esAdminRole } = require("../middlewares");

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProducto)

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio debe ser un número').isNumeric(),
    // check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    esCategoriaValida,
    check('disponible', 'La disponibilidad debe ser un valor booleano').not().isBoolean(),
    validarCampos
], crearProducto)

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio debe ser un número').isNumeric(),
    esCategoriaValida,
    check('disponible', 'La disponibilidad debe ser un valor booleano').not().isBoolean(),
    validarCampos
], actualizarProducto)

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], eliminarProducto)

module.exports = router