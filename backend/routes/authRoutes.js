const express = require("express");

const router = express.Router();

const {
    obtenerUsuarios,
    login
} = require("../controllers/authController");

router.get("/usuarios", obtenerUsuarios);

router.post("/login", login);

module.exports = router;