const express = require('express');
//remove header so backend is more hidden from client side in network
//hides version numbers as well. 
const helmet = require('helmet')
//logger that auto logs all incoming requests in terminal
//http code, route, response, seconds it took
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();//will automatically read .env file, set enviro variables

//set to star (Acces control origing) by default, so any origin can access backend
//setting it to only allow from our react app at localHost 3000
const middlewares = require('./middlewares');
const logs = require('./api/logs');

const app = express();







//connect to DB
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));
//body parsing middleware for reading body of requests of type json
app.use(express.json());

//when root of our application is requested
app.get('/', (req,res) => {
    res.json({
        message: 'hello World!',
    });
});

//use before not found handlers
app.use('/api/logs', logs);


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


const port = process.env.PORT || 1337;
app.listen(port, ()=> {
    console.log('Listening at http://localhost:{port}');
});