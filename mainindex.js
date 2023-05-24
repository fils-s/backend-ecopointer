
const express = require('express');
const cors = require('cors'); // middleware to enable CORS (Cross-Origin Resource Sharing)
const app = express();
const port = process.env.PORT  ; // use environment variables
const host = process.env.HOST;


app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data

// root route -- /api/
app.get('/', function (req, res) {
    res.status(200).json({ message: 'home -- Ecopointer api' });
});

// routing middleware for resource TUTORIALS
app.use('/Ecopointer/users', require('./routes/users.routes'))
app.use('/Ecopointer/events', require('./routes/eventos.routes'))
app.use('/Ecopointer/challenges', require('./routes/desafios.routes'))
app.use('/Ecopointer/bins', require('./routes/ecopontos.routes'))
app.use('/Ecopointer/faqs', require('./routes/faqs.routes'))
app.use('/Ecopointer/posts', require('./routes/posts.routes'))

// handle invalid routes
app.get('*', function (req, res) {
    res.status(404).json({ message: 'Erro no caminho' });
})
app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));
