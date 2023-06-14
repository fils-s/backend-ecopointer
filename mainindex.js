const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
  res.status(200).json({ message: 'home -- Ecopointer api' });
});

app.use('/Ecopointer/users', require('./routes/users.routes'))
app.use('/Ecopointer/events', require('./routes/eventos.routes'))
app.use('/Ecopointer/challenges', require('./routes/desafios.routes'))
app.use('/Ecopointer/bins', require('./routes/ecopontos.routes'))
app.use('/Ecopointer/faqs', require('./routes/faqs.routes'))
app.use('/Ecopointer/posts', require('./routes/posts.routes'))

app.get('*', function (req, res) {
  res.status(404).json({ message: 'Erro no caminho' });
})

const server = app.listen(port, host, function () {
  console.log(`Server running at http://${host}:${port}`);
});

module.exports = { app: app, server: server };
