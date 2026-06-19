const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
    crearReporte,
    obtenerReportes,
    obtenerReportesUsuario,
    actualizarEstado,
    eliminarReporte,
    obtenerEstadisticas
} = require("../controllers/reporteController");

router.get("/", obtenerReportes);

router.get("/estadisticas", obtenerEstadisticas);

router.get(
    "/usuario/:id",
    obtenerReportesUsuario
);

router.put(
    "/:id/estado",
    actualizarEstado
);

router.delete(
    "/:id",
    eliminarReporte
);

router.post("/", crearReporte);

router.post(
    "/upload",
    upload.single("imagen"),
    (req, res) => {

        res.json({
            success: true,
            ruta: req.file.filename
        });

    }
);

module.exports = router;