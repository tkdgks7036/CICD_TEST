const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT_NUMBER;
const cookieParser = require('cookie-parser');

const mainRouter = require('./routes/index.js');

app.use(express.json());
app.use(cookieParser());

app.use('/', mainRouter);


app.listen(port, () => {
    console.log('Node.js 주특기 Lv.3 과제가 오픈되었습니다.');
});