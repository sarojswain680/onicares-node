const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const { MONGOURI } = require('./config');
var cors = require('cors');

app.use(cors());

// Connecting to the database
mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});



require('./Models/userModel');
require('./Models/postModel');

app.use(express.json());
console.log('nkn')
app.use(require('./routes/auth'));
app.use(require('./routes/post'));


app.listen(PORT, () => {
    console.log('Server is runing on', PORT)
})