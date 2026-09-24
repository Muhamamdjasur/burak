// console.log("EXECUTED");

// import moment from "moment";

// const currentTime = moment().format("YYYY MM DD");
// console.log(currentTime);

// const person: string = "Jacob";
// const count: number = 100;


// Architectural pattern: MVC, DI, MVP

// Design pattern: Middlware, Decotar

import dotenv from 'dotenv';
dotenv.config();

// console.log("PORT:", process.env.PORT);

// console.log("MONGO_URL:", process.env.MONGO_URL);

// CLUSTER => DATABASE => COLLECTION => DOCUMENT


import mongoose from "mongoose";
import app from "./app";

mongoose
    .connect(process.env.MONGO_URL as string, {})
    .then((data) => {
        console.log("MongoDB connected successfully");
        const PORT = process.env.PORT ?? 3003;
        app.listen(PORT, function () {
            console.log(`The server is running successfully on port: ${PORT}`);
        });
    })
    .catch((err) => console.log("ERROR wit MongoDB connection, err"));