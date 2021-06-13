const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const app = express();

//MIDDLEWARE

app.use(express.json());
app.use(cors({ origin: process.env.PROD }));
app.use(morgan('dev'));

//ROUTES

//register and login

app.use('/auth', require('./routes/jwtAuth'));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
