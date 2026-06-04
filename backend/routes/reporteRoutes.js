const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
    crearReporte,
    obtenerReportes,
    obtenerEstadisticas
} = require("../controllers/reporteController");

router.get("/", obtenerReportes);

router.get("/estadisticas", obtenerEstadisticas);

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