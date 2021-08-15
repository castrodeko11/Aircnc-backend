const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
const socketio = require ('socket.io');
const http= require('http');

require('dotenv').config();

const app = express();
const server = http.Server(app);
const io = socketio(server);



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


const connectedUsers = {};
io.on('connection', socket => {
    // console.log(socket.handshake.query);
    // console.log('Usuario conectado', socket.id);

    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;


    // setTimeout(()=>{
    //     socket.emit('Hello','World');
    // })
    
    // socket.on('omni',data => {
    //     console.log(data);
    // })
});

// app.use(cors({origin:'http://localhost:3333'}));
app.use((req, res, next) => {
    req.io = io;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    req.connectedUsers = connectedUsers;

    return next();

})

app.use(cors());
app.use(express.json());
app.use('/files',express.static(path.resolve(__dirname,'..','uploads')));
app.use(routes);

server.listen(process.env.PORT || 3333);

//req.query = Acessar query params (para filtros)
//req.params = Acessar route params (para edição, delete)
//req.body = Acessar corpo da requisição (para criação, edição)

// app.use(express.json())

// app.get('/users',(req,res) => {
//     return res.json({idade: req.query.idade});
// });

// app.put('/users/:id',(req,res) => {
//     return res.json({id: req.params.id});
// });

// app.post('/users',(req,res) => {
//     return res.json(req.body);
// });

// app.post('/users',(req,res) => {
//     return res.json({message: "Hello Word"});
// });

// app.listen(3333);
