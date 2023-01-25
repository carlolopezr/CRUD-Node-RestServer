const { Schema, model } = require('mongoose')

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },

    img: String,

    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },

    estado: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false
    }

})

// Sobreescribiendo el metodo para quitar la version y el password al retornar el usuario
usuarioSchema.methods.toJSON = function () {
    const { __v, password, ...usuario } = this.toObject()
    return usuario;
}

module.exports = model('Usuario', usuarioSchema);