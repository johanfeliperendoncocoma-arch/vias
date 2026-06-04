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
            id_usuario
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

        res.json({
            total: total.recordset[0].total,
            accidentes: accidentes.recordset[0].total,
            danos: danos.recordset[0].total,
            pendientes: pendientes.recordset[0].total
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
    obtenerEstadisticas
};