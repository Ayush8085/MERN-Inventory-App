const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const contactRoute = require('./routes/contactRoute');
const errorHandler = require('./middleWare/errorMiddleware');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

// ------------- MIDDLEWARES -------------
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, "uploads")));

// ------------- ROUTES MIDDLEWARES -------------
app.use("/api/users", userRoute)
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

// ------------- ERROR MIDDLEWARES -------------
app.use(errorHandler);


// ------------- TEST ROUTE -------------
app.get('/', async (req, res) => {
    res.send('<h1>Yo Yo</h1>');
})

// ------------- CONNECT TO DB AND SERVER -------------
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, (req, res) => {
            console.log(`Server running on port: ${PORT}`);
        })
    })
    .catch(err => console.log(err.message));