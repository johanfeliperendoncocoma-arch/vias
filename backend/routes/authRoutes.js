const express = require("express");

const router = express.Router();

const {
    obtenerUsuarios,
    login,
    registro
} = require("../controllers/authController");

router.get("/usuarios", obtenerUsuarios);

router.post("/login", login);

router.post("/registro", registro);

module.exports = router;