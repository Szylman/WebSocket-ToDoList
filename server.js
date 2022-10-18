const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');
const cors = require('cors');

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});

const io = socket(server);

let tasks = [
    { id: 1, name: 'Shopping' },
    { id: 2, name: 'Playing guitar' },
];

io.on('connection', (socket) => {   

    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
    });

    socket.on('removeTask', (taskId) => {
        tasks = tasks.filter((task) => task.id !== taskId);
        socket.broadcast.emit('removeTask', userRemove);
    });
});

app.use(cors());

app.use(express.static(path.join(__dirname, '/client')));

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.js'));
});