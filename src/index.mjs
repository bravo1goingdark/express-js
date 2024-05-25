import express, { request, response } from 'express';
const app = express();
const PORT = 3000;
app.use(express.json());
const mockUser = [
    {id:1 , username:"Ashutosh", displayName:"don"},
    {id:2 , username:"Aakash" , displayName:"modi"},
    {id:3 , username:"Mayank" , displayName:"heroicMayank"},
    {id:4 , username:"Sunny" , displayName:"Mastergamer"},
]
// Routes/Endpoint
app.get('/' , (request , response) => {
    response.send("Hello World").sendStatus(201);
});

app.get('/api/users' , (request, response) => {
    response.send(mockUser)
});

app.get('/api/products' , (request, response) => {
    response.send([
        {id:1 , productName: "Pizza", cost:499},
    ])
});

// route params
app.get('/api/users/:id' , (request, response) => {
    // console.log(request.params); log all parameters passed to routes
    const parsedID = parseInt(request.params.id);
    if (isNaN(parsedID)) {
        return response.status(400).send("Bad Request! Invalid ID");
    }
    const findUser = mockUser.find((user) => user.id === parsedID);
    if (!findUser) {
        return response.send("User Not Found").sendStatus(404);
    }
    return response.send(findUser);

});

// query params
app.get('/api/user', (request, response) => {
    console.log(request.query);
    const {filter , substring} = request.query; // substring -> substring && filter by username
    if (filter && substring) {
        const filterdUser = mockUser.filter(
            // convert mockuser username to lowercase and then compare the received substring from query params
            (user) => user[filter].toLowerCase().includes(substring)
        );
        return response.send(filterdUser);
    }
    return response.send(mockUser);
});
// post request
app.post('/api/users', (request,response) => {
    console.log(request.body);
    const {body} = request;
    const newUser = {id:mockUser[mockUser.length-1].id+1 , ...body};
    mockUser.push(newUser);
    return response.send({msg:"user created succesfully", newUser}).sendStatus(201);
});

// put request
app.put('/api/users/:id' , (request,response) => {
    const { body,params:{id} } = request;
    const parsedID = parseInt(id);
    if (isNaN(parsedID)) {
        return response.status(400).send("Invalid ID");
    }
    const findUserIndex = mockUser.findIndex((user) => user.id === parsedID);
    if (findUserIndex === -1) {
        return response.status(404).send("User Not Found");
    }
    const updatedUser = {id:parsedID,...body};
    mockUser[findUserIndex] = updatedUser;
    return response.status(201).send("Updated Successfully");
});



app.listen(PORT , () => {
    console.log(`Listening on Port http://localhost:${PORT}`);
});