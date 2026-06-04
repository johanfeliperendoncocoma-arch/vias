require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { conectarDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const reporteRoutes = require("./routes/reporteRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    "/uploads",
    express.static("backend/uploads")
);
app.use('/api', authRoutes);
app.use("/api/reportes", reporteRoutes);

app.get('/', (req, res) => {
    res.send('API Reporte Vial funcionando');
});

conectarDB();

app.listen(process.env.PORT, () => {
    console.log(`Servidor en puerto ${process.env.PORT}`);
});
