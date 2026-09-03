const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// Servir la carpeta 'public' (tu HTML, CSS, y Sonidos)
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB (Railway pasará la variable MONGO_URL)
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/bostezos')
    .then(() => console.log('Conectado a la Base de Datos'))
    .catch(err => console.error('Error conectando a BD:', err));

// Modelo de Base de datos
const yawnSchema = new mongoose.Schema({
    date: String,
    time: String,
    timestamp: Number
});
const Yawn = mongoose.model('Yawn', yawnSchema);

// RUTAS DE LA API
// 1. Obtener todos los bostezos
app.get('/api/bostezos', async (req, res) => {
    try {
        const yawns = await Yawn.find().sort({ timestamp: -1 }); // Más recientes primero
        res.json(yawns);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

// 2. Guardar un nuevo bostezo
app.post('/api/bostezos', async (req, res) => {
    try {
        const nuevoBostezo = new Yawn(req.body);
        await nuevoBostezo.save();
        res.json(nuevoBostezo);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar' });
    }
});

// 3. Reiniciar contador (¡Cuidado, borrará lo de todos los usuarios!)
app.delete('/api/bostezos', async (req, res) => {
    try {
        await Yawn.deleteMany({});
        res.json({ message: 'Historial borrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al borrar' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));