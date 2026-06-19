const { pool } = require("../config/db");

// Crear reporte
const crearReporte = async (req, res) => {
    try {
        const {
            tipo_reporte, descripcion, gravedad,
            latitud, longitud, direccion, id_usuario, imagen
        } = req.body;

        await pool.query(
            `INSERT INTO Reportes
            (tipo_reporte, descripcion, gravedad, latitud, longitud, direccion, estado, id_usuario, imagen)
            VALUES (?, ?, ?, ?, ?, ?, 'Pendiente', ?, ?)`,
            [tipo_reporte, descripcion, gravedad, latitud, longitud, direccion, id_usuario, imagen]
        );

        res.json({ success: true, mensaje: "Reporte guardado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mensaje: "Error al guardar reporte" });
    }
};

// Obtener todos los reportes
const obtenerReportes = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM Reportes ORDER BY fecha_reporte DESC`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener reportes" });
    }
};

// Obtener reportes por usuario
const obtenerReportesUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            `SELECT * FROM Reportes WHERE id_usuario = ? ORDER BY fecha_reporte DESC`,
            [id]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener reportes del usuario" });
    }
};

// Actualizar estado
const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        await pool.query(
            `UPDATE Reportes SET estado = ? WHERE id_reporte = ?`,
            [estado, id]
        );

        res.json({ success: true, mensaje: "Estado actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error actualizando estado" });
    }
};

// Eliminar reporte
const eliminarReporte = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM Reportes WHERE id_reporte = ?`, [id]);
        res.json({ success: true, mensaje: "Reporte eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mensaje: "Error eliminando reporte" });
    }
};

// Estadísticas
const obtenerEstadisticas = async (req, res) => {
    try {
        const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM Reportes`);
        const [[{ total: accidentes }]] = await pool.query(`SELECT COUNT(*) AS total FROM Reportes WHERE tipo_reporte = 'Accidente'`);
        const [[{ total: danos }]] = await pool.query(`SELECT COUNT(*) AS total FROM Reportes WHERE tipo_reporte = 'Daño Vial'`);
        const [[{ total: pendientes }]] = await pool.query(`SELECT COUNT(*) AS total FROM Reportes WHERE estado = 'Pendiente'`);
        const [[{ total: enProceso }]] = await pool.query(`SELECT COUNT(*) AS total FROM Reportes WHERE estado = 'En Proceso'`);
        const [[{ total: solucionados }]] = await pool.query(`SELECT COUNT(*) AS total FROM Reportes WHERE estado = 'Solucionado'`);

        res.json({ total, accidentes, danos, pendientes, enProceso, solucionados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error obteniendo estadísticas" });
    }
};

module.exports = {
    crearReporte,
    obtenerReportes,
    obtenerReportesUsuario,
    actualizarEstado,
    eliminarReporte,
    obtenerEstadisticas
};
