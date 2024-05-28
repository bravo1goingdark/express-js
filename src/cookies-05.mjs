import express, { request, response } from "express";
import cookieParser from "cookie-parser";
const app = express();


app.use(cookieParser("secret"));
app.get('/cookies' , (request,response) => {
    response.cookie("hello" , "world" , {maxAge: 10000 * 60 , signed:true});
    console.log(request.headers.cookie); // log name-value pair before pasrsing using cookie-parser
    console.log(request.cookies); // logs after using cookie-parser
    if (request.cookies.hello && request.cookies.hello === "world") {
        return response.send("send you a cookie");
    }
    return response.status(403).send({msg: "sorry no cookies"});
});

app.listen(3000 , () => {
    console.log(`server running on ${3000}`);
})