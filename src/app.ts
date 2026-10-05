import "dotenv/config";

import express from "express";
import path from "path";
import morgan from "morgan";
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";

import router from "./router";
import routerAdmin from "./router-admin";
import { MORGAN_FORMAT } from "./libs/config";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL), // .env dagi nom bilan bir xil
    collection: "sessions",
});

/** 1-ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/
app.use(
    session({
        secret: String(process.env.SESSION_SECRET),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }, // 1 day
        store: store,
        resave: true,
        saveUninitialized: true,
    })
);

/** 3-VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 4-ROUTERS **/
app.use("/admin", routerAdmin);  // EJS
app.use("/", router);            // REACT

export default app;