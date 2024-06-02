// secret-key ->  thapQjvofaNNMoG8WXC-JMoCiDYx3koK
// client-id -> 1246725955310059550
// endpoint -> http://locahost:3000/api/auth/discord/redirect

import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { checkSchema, matchedData, validationResult} from "express-validator";
import { createPostUserValidationSchema } from "../utils/validationSchema.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import passport from "passport";
import "../strategies/discord-strategy.mjs";
import { hashPassword} from "../utils/hashPassword.mjs";
const app = express();
const PORT = 3000;


// connecting to the mongodb database
mongoose.connect("mongodb://127.0.0.1/learning_express_db")
.then(() => console.log("Connected to Databse"))
.catch((err) => console.log(err));

app.use(session({
    secret: "learning express", // secret itself should be not easily parsed by a human and would best be a random set of characters
    saveUninitialized: false,
    resave:true,
    cookie: {
        maxAge: 60000 * 60
    },
    // storing session on MongoDB
    store: MongoStore.create({
        client : mongoose.connection.getClient()
    })
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.post('/api/users',checkSchema(createPostUserValidationSchema), async (request,response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(400).send(result.array());
    }
    const data = matchedData(request);
    // modifying string password with hashed password 
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
    } catch (err) {
        console.log(err);
        return response.status(400).send("not able to save user");
    }
    return response.status(201).send({msg:"user created succesfully", newUser});
});

app.post("/api/auth" ,passport.authenticate("local") , (request,response) => {

    response.sendStatus(200);
});

// get the authentication status
app.get("/api/auth/status" , (request,response) => {
    console.log(`inside /api/auth/status`);
    console.log(request.session);
    return request.user ? response.send(request.user) : response.sendStatus(401);
});


// used to logout the user session
app.post("/api/auth/logout", (request,response) => {
    if (!request.user) {
        response.sendStatus(401);
    }
    request.logout((err) => {
        if(err) {
            return response.sendStatus(400);
        }
        return response.sendStatus(200);
    });
});

app.get("/api/auth/discord" , passport.authenticate("discord"));
app.get("/api/auth/discord/redirect" , passport.authenticate("discord"),(request,response) => {
    console.log(request.user);
    response.json({msg:"succesfully authenticated"})
});

app.listen(PORT , () => {
    console.log(`server running on ${PORT}`);
});