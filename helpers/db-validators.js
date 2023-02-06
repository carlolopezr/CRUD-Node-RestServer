const { Categoria, Role, Usuario, Producto } = require('../models');


const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`el rol ${rol} no está registrado en la base de datos`);
    }
}

const emailExiste = async (correo = '') => {

    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe en la base de datos`)
    }
}

const existeUsuarioPorId = async (id) => {

    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe en la base de datos`)
    }
}

const existeCategoria = async (id) => {

    try {
        const existeCategoria = await Categoria.findById(id)
        if (!existeCategoria) {
            throw new Error(`No existe una categoria con el id ${id}`)
        }
    } catch (error) {
        throw new Error(`Ocurrio un error ${error}`)
    }
}

const existeProducto = async (id) => {

    const existeProducto = await Producto.findById(id)
    if (!existeProducto) {
        throw new Error(`No existe un producto con el id ${id}`)
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La colección ${coleccion} no esta permitida`)
    }

    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}