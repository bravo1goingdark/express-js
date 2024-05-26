import express, { request, response } from 'express';
const app = express();
const PORT = 3000;

// middleware for logging the request method and request url
const logMethods = (request,response,next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
};
const resolveIndexByUserID = (request,response,next) => {
    const {params:{id} } = request;
    const parsedID = parseInt(id);
    if (isNaN(parsedID)) {
        return response.status(400).send("Invalid ID");
    }
    const findUserIndex = mockUser.findIndex((user) => user.id === parsedID);
    if (findUserIndex === -1) {
        return response.status(404).send("User Not Found");
    }
    // we can attach properties dynamically to request object
    request.findUserIndex = findUserIndex;
    next();

};
app.use(express.json());
// app.use(logMethods) --> mounting the logMethods middleware globally
const mockUser = [
    {id:1 , username:"Ashutosh", displayName:"don"},
    {id:2 , username:"Aakash" , displayName:"modi"},
    {id:3 , username:"Mayank" , displayName:"heroicMayank"},
    {id:4 , username:"Sunny" , displayName:"Mastergamer"},
]
// the middleware can also be passed individually to each routes
app.get('/' ,logMethods, (request , response) => {
    response.send("Hello World").status(201);
});

app.get('/api/users' , (request, response) => {
    response.send(mockUser);
});

app.get('/api/products',logMethods, (request, response) => {
    response.send([
        {id:1 , productName: "Pizza", cost:499},
    ])
});

// route params
app.get('/api/users/:id',resolveIndexByUserID , (request, response) => {
    // console.log(request.params); log all parameters passed to routes
    const {findUserIndex} = request;
    const findUser = mockUser[findUserIndex];
    if (!findUser) {
        return response.sendStatus(404).send("User Not Found");
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
    return response.sendStatus(201).send({msg:"user created succesfully", newUser});
});

// put request
app.put('/api/users/:id',resolveIndexByUserID , (request,response) => {
    const {body , findUserIndex} = request;
    const updatedUser = { id:mockUser[findUserIndex].id, ...body};
    mockUser[findUserIndex] = updatedUser;
    return response.status(201).send("Updated Successfully");
});
app.patch('/api/users/:id',resolveIndexByUserID , (request,response) => {
    const { body,findUserIndex } = request;
    // If there are any duplicate keys between mockUser[findUserIndex] and body,
    // the value from body will overwrite the value from mockUser[findUserIndex].
    mockUser[findUserIndex] = { ...mockUser[findUserIndex], ...body};
    return response.status(201).send("Updated Successfully");
});

// delete request
app.delete('/api/users/:id',resolveIndexByUserID , (request,response) => {
    const {findUserIndex} = request;
    mockUser.splice(findUserIndex,1);
    return response.status(201).send("Deleted Successfully");
});

app.listen(PORT , () => {
    console.log(`Listening on Port http://localhost:${PORT}`);
});