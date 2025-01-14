import express from 'express';
import session from 'express-session';
import moment from 'moment-timezone'

const app = express();

// Configuración del middleware de sesiones
app.use(
    session({
        secret: 'p3-GRPC#tobiasperro-sesionespersistentes', // Clave secreta para firmar cookies
        resave: false, // No guardar sesión si no hay cambios
        saveUninitialized: true, // Guardar sesiones nuevas aunque estén vacías
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 1 día en milisegundos
            httpOnly: true, // Solo accesible por HTTP (más seguro)
            secure: false, // Cambiar a true si usas HTTPS
        },
    })
);

// Ruta para iniciar sesión
app.get('/iniciar-sesion', (req, res) => {
    if (!req.session.inicio) {
        req.session.inicio = new Date(); // Fecha de inicio de sesión
        req.session.ultimoAcceso = new Date(); // Última consulta inicial
        res.send('Sesión iniciada');
    } else {
        res.send('La sesión ya está activa');
    }
});

// Ruta para actualizar la fecha de última consulta
app.get('/actualizar', (req, res) => {
    if (req.session.inicio) {
        req.session.ultimoAcceso = new Date();
        res.send('Fecha de última consulta actualizada');
    } else {
        res.send('No hay una sesión activa');
    }
});

// Ruta para ver el estado de la sesión
app.get('/estado-sesion', (req, res) => { 
    if (req.session.inicio) { 
        const inicio = new Date(req.session.inicio); // Convertimos a objeto Date
        const ultimoAcceso = new Date(req.session.ultimoAcceso); // Convertimos a objeto Date
        const ahora = new Date();

        if (isNaN(inicio.getTime()) || isNaN(ultimoAcceso.getTime())) {
            return res.status(400).json({ mensaje: 'Datos de sesión inválidos.' });
        }

        // Calcular la antigüedad de la cuenta
        const antiguedadMs = ahora - inicio;
        const horas = Math.floor(antiguedadMs / (1000 * 60 * 60));
        const minutos = Math.floor((antiguedadMs % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((antiguedadMs % (1000 * 60)) / 1000);

        // Convertimos las fechas al huso horario de CDMX
        const inicioCDMX = moment(inicio).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        const ultimoAccesoCDMX = moment(ultimoAcceso).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');

        res.json({
            mensaje: `Estado de la sesión`,
            sesionId: req.session.id, // Cambiado para mostrar solo el ID
            inicio: inicioCDMX,
            ultimoAcceso: ultimoAccesoCDMX,
            antiguedad: `${horas} horas, ${minutos} minutos, ${segundos} segundos`
        });
    } else {
        res.send('No hay una sesión activa');
    }
});


// Ruta para cerrar la sesión
app.get('/cerrar-sesion', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error al cerrar la sesión');
            }
            res.send('Sesión cerrada correctamente');
        });
    } else {
        res.send('No hay una sesión activa para cerrar');
    }
});

// Iniciar servidorr
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
