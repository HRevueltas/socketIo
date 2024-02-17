const { join } = require('node:path');
const { createServer } = require('node:http');
const express = require('express');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('node:path');

const app = express();
const server = createServer(app);
const io = socketIo(server);

// Configuración de la ruta raíz con express
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '/index.html'))
});

// Función para guardar un mensaje en el archivo
function saveChatMessage(message) {
    fs.appendFile('chat_history.txt', message + '\n', (err) => {
        if (err) {
            console.error('Error al guardar el mensaje:', err);
        }
    });
}

// Función para obtener el historial de mensajes desde el archivo
function getChatHistory(callback) {
    fs.readFile('chat_history.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            callback([]);
        } else {
            const messages = data.split('\n').filter(Boolean); // Elimina líneas vacías
            callback(messages);
        }
    });
}

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    getChatHistory((messages) => {
        socket.emit('chat history', messages);
    });

    socket.on('chat message', (msg) => {
        console.log('Mensaje recibido: ' + msg);
        io.emit('chat message', msg);
        saveChatMessage(msg);
    });

    socket.on('disconnect', () => {
        console.log('El cliente se ha desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
