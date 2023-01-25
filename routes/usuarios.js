const { Router } = require('express');
const { body, check } = require('express-validator');

const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators')


const router = Router();

const validaciones = [
    body('nombre', 'El nombre es requerido').not().isEmpty(),
    body('correo', 'El correo no es válido').isEmail(),
    body('correo').custom(emailExiste),
    body('password', 'El password debe tener más de 6 caracteres').isLength({ min: 6 }),
    // body('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE'])
    body('rol').custom(esRoleValido),
    validarCampos]


router.get('/', usuariosGet);

router.put('/:id', [
    check('id', `el id no es valido`).isMongoId(),
    check('id').custom(existeUsuarioPorId),
    body('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.post('/', validaciones, usuariosPost);

router.delete('/:id', [
    check('id', `el id no es valido`).isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);





module.exports = router;