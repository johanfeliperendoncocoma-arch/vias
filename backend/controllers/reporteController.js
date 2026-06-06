const { sql } = require("../config/db");

// Crear reporte
const crearReporte = async (req, res) => {

    try {

        const {
            tipo_reporte,
            descripcion,
            gravedad,
            latitud,
            longitud,
            direccion,
            id_usuario,
            imagen
        } = req.body;

        await sql.query(`
            INSERT INTO Reportes
            (
                tipo_reporte,
                descripcion,
                gravedad,
                latitud,
                longitud,
                direccion,
                estado,
                id_usuario
            )
            VALUES
            (
                '${tipo_reporte}',
                '${descripcion}',
                '${gravedad}',
                ${latitud},
                ${longitud},
                '${direccion}',
                'Pendiente',
                ${id_usuario}
            )
        `);

        res.json({
            success: true,
            mensaje: "Reporte guardado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            mensaje: "Error al guardar reporte"
        });

    }

};

// Obtener todos los reportes
const obtenerReportes = async (req, res) => {

    try {

        const resultado = await sql.query(`
            SELECT *
            FROM Reportes
            ORDER BY fecha_reporte DESC
        `);

        res.json(resultado.recordset);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener reportes"
        });

    }

};

// Obtener reportes por usuario
const obtenerReportesUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await sql.query(`
            SELECT *
            FROM Reportes
            WHERE id_usuario = ${id}
            ORDER BY fecha_reporte DESC
        `);

        res.json(resultado.recordset);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener reportes del usuario"
        });

    }

};

// Actualizar estado
const actualizarEstado = async (req, res) => {

    try {

        const { id } = req.params;
        const { estado } = req.body;

        await sql.query(`
            UPDATE Reportes
            SET estado = '${estado}'
            WHERE id_reporte = ${id}
        `);

        res.json({
            success: true,
            mensaje: "Estado actualizado"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error actualizando estado"
        });

    }

};

// Estadísticas
const obtenerEstadisticas = async (req, res) => {

    try {

        const total =
            await sql.query(`
                SELECT COUNT(*) AS total
                FROM Reportes
            `);

        const accidentes =
            await sql.query(`
                SELECT COUNT(*) AS total
                FROM Reportes
                WHERE tipo_reporte = 'Accidente'
            `);

        const danos =
            await sql.query(`
                SELECT COUNT(*) AS total
                FROM Reportes
                WHERE tipo_reporte = 'Daño Vial'
            `);

        const pendientes =
            await sql.query(`
                SELECT COUNT(*) AS total
                FROM Reportes
                WHERE estado = 'Pendiente'
            `);

        const enProceso =
            await sql.query(`
                SELECT COUNT(*) AS total
                FROM Reportes
                WHERE estado = 'En Proceso'
            `);

        const solucionados =
            await sql.query(`
                SELECT COUNT(*) AS total
                FROM Reportes
                WHERE estado = 'Solucionado'
            `);

        res.json({
            total: total.recordset[0].total,
            accidentes: accidentes.recordset[0].total,
            danos: danos.recordset[0].total,
            pendientes: pendientes.recordset[0].total,
            enProceso: enProceso.recordset[0].total,
            solucionados: solucionados.recordset[0].total
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error obteniendo estadísticas"
        });

    }

};
module.exports = {
    crearReporte,
    obtenerReportes,
    obtenerReportesUsuario,
    actualizarEstado,
    obtenerEstadisticas
};