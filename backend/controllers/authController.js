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

const registro = async (req, res) => {

    try {

        const {
            nombre,
            correo,
            password
        } = req.body;

        const existe = await sql.query(`
            SELECT *
            FROM Usuarios
            WHERE correo = '${correo}'
        `);

        if (existe.recordset.length > 0) {

            return res.status(400).json({
                mensaje: "El correo ya existe"
            });

        }

        const hash =
            await bcrypt.hash(password, 10);

        await sql.query(`
            INSERT INTO Usuarios
            (
                nombre,
                correo,
                password_hash,
                rol
            )
            VALUES
            (
                '${nombre}',
                '${correo}',
                '${hash}',
                'Cliente'
            )
        `);

        res.json({
            success: true,
            mensaje: "Usuario registrado correctamente"
        });

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

        const usuario =
            resultado.recordset[0];

        const passwordValida =
            await bcrypt.compare(
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
    login,
    registro
};