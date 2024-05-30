import express, { request, response } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { resolveIndexByUserID } from "../utils/middleware.mjs";
import { mockUser } from "../utils/constants.mjs";
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
}));
// app.use(routes);
app.use(cookieParser("secret"));
app.use(express.json());


app.get('/session' , (request,response) => {
    console.log(request.session);
    console.log(request.session.id);// request.session.id or request.sessionID
    request.session.visited = true;
    response.cookie("hello" , "world" , {maxAge: 10000 , signed:true});
    
    return response.status(201).send({msg: "cookies"});
});
app.get('/api/users/:id',resolveIndexByUserID , (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    const {findUserIndex} = request;
    const findUser = mockUser[findUserIndex];
    if (!findUser) {
        return response.status(404).send("User Not Found");
    }
    return response.send(findUser);
});

// authenticating user and creating a session 
app.post('/api/auth' , (request,response) => {
    const {body :{username , password}} = request;
    const findUser = mockUser.find((user) => user.username === username);
    if(!findUser || findUser.password !== password) {
        return response.status(400).send("user not found")
    }
    request.session.user = findUser;
    return response.status(200).send(findUser);
});

// checking user authentication status
app.get('/api/auth/status' , (request,response) => {
    request.sessionStore.get(request.sessionID , (err , sessionData) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(sessionData);
    });

    return request.session.user ? 
    response.status(201).send(request.session.user) : response.status(400).send("not authenticated");
});

// user can add item into carts
app.post('/api/carts' , (request,response) => {
    if (!request.session.user) {
        return response.status(401).send("user not found");
    }
    const {body:item} = request;
    const {cart} = request.session;

    if (cart) {
        cart.push(item);
    }else {
        request.session.cart = [item];
    }
    return response.status(201).send(item);
});

// user can see item in the cart
app.get('/api/carts' , (request,response) => {
    if (!request.session.user) {
        return response.status(401).send("user not found");
    }
    return response.send(request.session.cart ?? [])
});

app.listen(PORT , () => {
    console.log(`server running on ${PORT}`);
});