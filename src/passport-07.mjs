import express, { request, response } from "express";
import session from "express-session";
import passport from "passport";
import "../strategies/local-strategy.mjs";
const app = express();
const PORT = 3000;
// make sure to use session before all routes
app.use(session({
    secret: "learning express", // secret itself should be not easily parsed by a human and would best be a random set of characters
    saveUninitialized: false,
    resave:false,
    cookie: {
        maxAge: 60000 * 60
    }
}))// use passport after session() and before routes (app.use(routes);)

app.use(express.json());
app.use(passport.initialize()); //intializes Passport for incoming requests, allowing authentication strategies to be applied
app.use(passport.session());// Middleware that will restore login state from a session


// passport.authenticate(strategy) -->Applies the named strategy (or strategies) to the incoming request, in order to authenticate the request.
// passport attach the user to request body
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



app.listen(PORT , () => {
    console.log(`server running on ${PORT}`);
});