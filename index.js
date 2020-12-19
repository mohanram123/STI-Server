const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const subRouter = require('./routes/subjectRoutes');

const app = express();
const port = process.env.PORT || 3000;

require('./db');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.json({message:"renderd homepage"});
})

app.use('/subjects',subRouter);

app.use((req,res,next)=>{
    next(createError.NotFound('This route does not exist'))
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message: err.message
        },
    })
})

app.listen(port, err => {
	if (err)
		throw err
	console.log(`Server running at ${port}.....`);
});
