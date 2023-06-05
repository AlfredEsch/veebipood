import mongoose from "mongoose";
import bodyParser from "body-parser";
import customerController from "./controllers/customerController";
import deviceController from "./controllers/deviceController";
import usageController from "./controllers/usageController";

mongoose.connect("mongodb+srv://alfredeschbaum:Ul3fyTKXn8y3rGtP.nzpoyhc.mongodb.net/test\n" +
    "\n");
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

import express, { Express, Request, Response } from "express";


const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', customerController);
app.use('/', deviceController);
app.use('/', usageController);


app.listen(3000,() => {
    console.log(`[server]: Server is running at http://localhost:3000`);
})
