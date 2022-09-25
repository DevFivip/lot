const express = require('express');
const cors = require("cors");
const http = require('http');
const app = express();
const { Op } = require('sequelize');
const bodyParser = require('body-parser');
const animalitos = require('../utils/animalitos.json')
const horarios = require('../utils/horarios.json')

const { Register } = require('../app/models');

/** MIDDLEWARE */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



/**SOCKET IMPLEMENT */
const servidor = http.createServer(app);

const socketio = require('socket.io');
const { DefaultDeserializer } = require('v8');
const io = socketio(servidor, {
    cors: {
        origin: "http://192.168.2.3:5173",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})

io.on('connection', socket => {
    socket.on('conectado', () => {
        // console.log('usuario conectado')
    })

    // socket.on('girar', ({ numero_resultado }) => {
    //     console.log('girando', numero_resultado)
    //     io.emit('resultado', { numero_resultado })
    // })
})

/**END SOCKET IMPLEMENT */




/**ROUTES */
app.get('/', (req, res) => {
    res.send(new Date());
});

app.post('/register-lotto-valid', async (req, res) => {

    const animalito = req.body

    // console.log(animalito, animalitos, horarios)

    let fund = null;

    animalitos.forEach((v, k) => {
        if (v.option === animalito.number) {
            fund = k
        }
    })

    const numero_resultado = fund

    console.log({ numero_resultado })

    const Registe = await Register.create(animalito)

    io.emit('resultado', { numero_resultado })

    res.json(Registe);
});


app.post('/history', async (req, res) => {

    let date = null;
    if (!req.body.fecha) {
        date = new Date();
        // console.log(date,date.toDateString())
    } else {
        date = new Date(req.body.fecha);
    }

    const startedDate = new Date(date.toISOString().split('T')[0]);
    const today = new Date(date.toISOString().split('T')[0]);

    //days
    // let today = new Date();
    let end = today.setHours(today.getHours() + 23);
    let endDate = new Date(end);
    console.log(startedDate, endDate)

    // const register = await Register.findAll({
    //     where: {
    //         createdAt: {
    //             $between: [startDay, endDay]
    //         }
    //     }
    // })

    Register.findAll({
        where: { "createdAt": { [Op.between]: [startedDate, endDate] } }
    })
        .then((result) => res.status(200).json({ data: result }))
        .catch((error) => res.status(404).json({ errorInfo: error }))

});
/**END ROUTES */




servidor.listen(3006, '0.0.0.0', () => console.log('server socket listener on port 3006 '))