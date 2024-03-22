//import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();

// app
const app = express();

// db
mongoose.connect(process.env.MONGO_URI, {
    useNewURLParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log("DB CONNECTED"))
.catch((err) => console.log("DB CONNECTION ERROR", err));

// middleware
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors({ origin : true, credentials : true }));


// routes
const testRoutes = require('./routes/test');
app.use('/', testRoutes);

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/profile'));

// port
const port = process.env.PORT || 8080;

// listenser

const server = app.listen(port, () => console.log(`Server is running on port ${port}`));