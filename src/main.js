const express = require('express');
const moment = require('moment-timezone');
const cors = require("cors");
const http = require('http');
const app = express();
const { Op } = require('sequelize');
const bodyParser = require('body-parser');
const animalitos = require('../utils/animalitos.json')
const horarios = require('../utils/horarios.json')

const { Register } = require('../app/models');


var corsOptions = {
    origin: 'https://lottoplus.plus',
    optionsSuccessStatus: 200 // For legacy browser support
}

/** MIDDLEWARE */
//app.use(cors(corsOptions));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



/**SOCKET IMPLEMENT */
const servidor = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(servidor, {
    cors: {
        origin: "https://lottoplus.plus",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["production-access"],
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

    ddd = moment().tz("America/Caracas").format();

    res.send(ddd)
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

    const Registe = await Register.create(animalito)

    io.emit('resultado', { Registe, numero_resultado })

    res.json(Registe);
});


app.post('/history', async (req, res) => {

    let date = null;



    // const format1 = "YYYY-MM-DD HH:mm:ss"

    // var date1 = new Date("2020-06-24 22:57:36");


    // dateTime1 = moment(date1).format(format1);



    // console.log({ dateTime2 })



    if (!req.body.fecha) {

        const format2 = "YYYY-MM-DD"
        var date2 = new Date();
        datex = moment(date2).tz("America/Caracas").format(format2);

        date = new Date(datex);


        // let dateNow = new Date().toLocaleString({ timeZone: "America/Caracas" }).split('T')[0];
        // dateNow = dateNow.split(" ")
        // rev = dateNow[0].split("/").reverse().join("-");
        // // console.log({ dateNow })
        // // console.log({ rev })
        // date = new Date(rev);
        // console.log({ date })
    } else {
        date = new Date(req.body.fecha);
        // console.log({ date })
    }


    // res.json({date})

    // console.log(date.toISOString());

    const startedDate = new Date(date.toISOString().split('T')[0] + ' 00:00:00');
    const today = new Date(date.toISOString().split('T')[0] + " 00:00:00");



    //days
    // let today = new Date();
    let end = today.setHours(today.getHours() + 23);
    let endDate = new Date(end);
    // res.send({endDate})
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

// app.get("/loop", async (req, res) => {

//     const currentMoment = moment().subtract(180, 'days');
//     const endMoment = moment().add(2, 'days');

//     const schedule = [
//         "08 AM",
//         "09 AM",
//         "10 AM",
//         "11 AM",
//         "12 AM",
//         "01 PM",
//         "02 PM",
//         "03 PM",
//         "04 PM",
//         "05 PM",
//         "06 PM",
//         "07 PM",
//         "08 PM",
//     ]



//     while (currentMoment.isBefore(endMoment, 'day')) {
//         console.log(`Loop at ${currentMoment.format('YYYY-MM-DD')}`);

//         for (let i = 0; i < schedule.length; i++) {
//             const hora = schedule[i]

//             const  ram = getRandomInt(38);
//             _animalito =  animalitos[ram]
//             animalito = {}
//             animalito.name = _animalito.name
//             animalito.number = _animalito.option
//             animalito.schedule = hora
//             animalito.createdAt = currentMoment.format('YYYY-MM-DD')
//             animalito.updatedAt = currentMoment.format('YYYY-MM-DD')
            
//             const reg = await Register.create(animalito)


//         }   




//         currentMoment.add(1, 'days');
//     }



//     res.send("success");

// });

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

servidor.listen(3006, () => console.log('server socket listener on port 3006 '))