const express = require('express');
const mongoose = require('mongoose'); 
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth');
const PORT = 3000;
const uri = "mongodb+srv://vishaldhanasekarcse2023:youth25@cluster0.kiqfamu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


//! MongoDB Connection
mongoose.connect(uri, {useNewUrlParser : true, 
                    useUnifiedTopology : true})
    .then(() => {console.log("\nConnection is successful")})
    .catch((error) => {console.log("Connection failed", error)});

//! No idea about this
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname,'static')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'register.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'home.html'));
});

app.use('/', authRoutes);



//! Server starting
app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`);
} )