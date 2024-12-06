const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Importar variables de entorno desde .env

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Conectar a MongoDB Atlas usando una URI segura desde .env
const dbUri = process.env.MONGO_URI || "mongodb+srv://Gregorio:Gregorio200@cluster0.djnazdz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbUri, { useNewUrlParser: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

// Esquema y modelo
const registroSchema = new mongoose.Schema({
    nombrelibro: String,
    autor: String,
    nombre: String,
    apellido: String,
    correo: String,
    message: String,
    fechaNacimiento: Date,
    edad: Number
});

const Registro = mongoose.model('Registro', registroSchema);

// Ruta para agregar o modificar registros
app.post('/addOrUpdate', async (req, res) => {
    const { id, nombrelibro, autor, nombre, apellido, correo, message, fechaNacimiento, edad } = req.body;
    try {
        if (id) {
            const registroActualizado = await Registro.findByIdAndUpdate(
                id,
                { nombrelibro, autor, nombre, apellido, correo, message, fechaNacimiento, edad },
                { new: true }
            );
            res.status(200).send(`Registro actualizado: ${registroActualizado}`);
        } else {
            const nuevoRegistro = new Registro({ nombrelibro, autor, nombre, apellido, correo, message, fechaNacimiento, edad });
            await nuevoRegistro.save();
            res.status(201).send('Registro agregado exitosamente');
        }
    } catch (err) {
        res.status(500).send('Error al agregar o modificar el registro');
    }
});

// Ruta para eliminar registros
app.post('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        await Registro.findByIdAndDelete(id);
        res.status(200).send('Registro eliminado exitosamente');
    } catch (err) {
        res.status(500).send('Error al eliminar el registro');
    }
});

// Ruta para ver todos los registros
app.get('/view', async (req, res) => {
    try {
        const registros = await Registro.find();
        res.status(200).json(registros);
    } catch (err) {
        res.status(500).send('Error al obtener los registros');
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
