//import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./../../routes/UserRoutes";
import authRoutes from "./../../routes/AuthRoutes";
import eventRoutes from "./../../routes/EventRoutes";

const app = express();

// app.get('/', (req, res) => {
//     res.status(200).json({msg: "Hello World!"});
// });

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

//dotenv.config();

// Routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/event', eventRoutes);

//credentials
// const dbUser = process.env.DB_USER;
// const dbPassword = process.env.DB_PASS;

mongoose.connect(`mongodb://127.0.0.1:27017/eventsdb`).then(() => {
    app.listen(3000);
    console.log('WOW! Server Up!');
})
.catch((err) => console.log(err));
