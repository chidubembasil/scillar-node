const express = require('express');
const http = require('http');
const Primus = require('primus');
const app = express()
const mongoose = require('mongoose')


app.use(express.json());


const authRoute = require('./routes/auth.js')
app.get('/', (req, res) => {
    res.send('Scillar backend is working')
})
app.use('/auth', authRoute)

const nessaRoute = require('./routes/nessaAi.js');
app.use('/nessa', nessaRoute);


const listingRoute = require('./routes/listings.js')
app.use('/listings', listingRoute)


// HTTP server
const server = http.createServer(app);
// Primus setup
const primus = new Primus(server, { transformer: 'websockets' });

// Store Primus instance in app.locals so routers can access it
app.locals.primus = primus;

primus.on('connection', (spark) => {
    console.log('Client connected');

    spark.on('data', (data) => {
        console.log('Received from client:', data);
        // Optionally broadcast back
        primus.write(data);
    });

    spark.on('end', () => console.log('Client disconnected'));
});
// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/tripp')
    .then(() => {
        console.log('Mongodb connected')
    })
    .catch((err) => {
        console.log(err)
    })




app.listen(8000, () => {
    console.log('Server is working')
})