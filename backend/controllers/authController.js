const { pool } = require("../config/db");
const bcrypt = require("bcrypt");

const obtenerUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM Usuarios`);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error del servidor" });
    }
};

const registro = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        const [existe] = await pool.query(
            `SELECT * FROM Usuarios WHERE correo = ?`,
            [correo]
        );

        if (existe.length > 0) {
            return res.status(400).json({ mensaje: "El correo ya existe" });
        }

        const hash = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO Usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, 'Cliente')`,
            [nombre, correo, hash]
        );

        res.json({ success: true, mensaje: "Usuario registrado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error del servidor" });
    }
};

const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const [rows] = await pool.query(
            `SELECT * FROM Usuarios WHERE correo = ?`,
            [correo]
        );

        if (rows.length === 0) {
            return res.status(401).json({ mensaje: "Usuario no encontrado" });
        }

        const usuario = rows[0];

        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
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
        res.status(500).json({ mensaje: "Error del servidor" });
    }
};

module.exports = { obtenerUsuarios, login, registro };
