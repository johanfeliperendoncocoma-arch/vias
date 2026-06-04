const { sql } = require("../config/db");
const bcrypt = require("bcrypt");

const obtenerUsuarios = async (req, res) => {
    try {

        const resultado = await sql.query(`
            SELECT *
            FROM Usuarios
        `);

        res.json(resultado.recordset);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error del servidor"
        });

    }
};

const login = async (req, res) => {

    try {

        const { correo, password } = req.body;

        const resultado = await sql.query(`
            SELECT *
            FROM Usuarios
            WHERE correo = '${correo}'
        `);

        if (resultado.recordset.length === 0) {
            return res.status(401).json({
                mensaje: "Usuario no encontrado"
            });
        }

        const usuario = resultado.recordset[0];

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password_hash
        );

        if (!passwordValida) {
            return res.status(401).json({
                mensaje: "Contraseña incorrecta"
            });
        }

        res.json({
            success: true,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error del servidor"
        });

    }
};

module.exports = {
    obtenerUsuarios,
    login
};