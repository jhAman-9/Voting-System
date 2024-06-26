const express = require('express')
const app = express();
const db = require('./db.js')
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;


const userRoutes = require('./routes/user.routes.js')
const candidateRoutes = require('./routes/candidate.routes.js')

app.use(`/user`, userRoutes);
app.use(`/candidate`, candidateRoutes);

app.listen(PORT, () => {
    console.log(`Listen on Port : ${PORT}`)
})