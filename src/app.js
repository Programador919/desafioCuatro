import express from 'express';
import {engine} from 'express-handlebars';
import {__dirname} from './utils.js';
import * as path from 'path';
import { Server } from 'socket.io';

const app = express();
const PORT = 8080;

const server = app.listen(PORT, ()=> {
    console.log(`Server escuchando en ${PORT}`)
});

const io  = new Server(server);

app.engine("handlebars",engine());
app.set('view engine', "handlebars");
app.set('views', path.resolve(__dirname + "/views"));

app.use("/", express.static(__dirname + "/public"));


app.get("/", (req, res) => {
    res.render("index")
})

const message = [] 

io.on('connection', socket => {
    console.log(`User ${socket.id} Connection `)
    //Nombre del usuario
    let userName = "";
    //Mensaje de connecion
    socket.on('userConnetion', (data) => {
        userName = data.user
        message.push({
            id: socket.id,
            info: 'connection',
            name: data.user,
            message: `${data.user} Connectado`,
            date: new Date().toTimeString(),
        })
        io.sockets.emit("userConnection", message);
    })
    //Mensaje de mensaje enviado
    socket.on('userMessage', (data) => {
        message.push({
            id: socket.id,
            info: 'message',
            name: userName,
            message: data.message,
            date: new Date().toTimeString(),
        })
        io.sockets.emit("userMessage", message);
    })
    //muestra el usuario que esta escribiendo a los demas en el chat
socket.on('typing', data =>{
    socket.broadcast.emit('typing', data);
})
})

//backend