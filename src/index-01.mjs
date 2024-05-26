import express, { request, response } from 'express';
import { mockUser } from '../utils/constants.mjs';
const app = express();
const PORT = 3000;
app.use(express.json());

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
app.patch('/api/users/:id' , (request,response) => {
    const { body,params:{id} } = request;
    const parsedID = parseInt(id);
    if (isNaN(parsedID)) {
        return response.status(400).send("Invalid ID");
    }
    const findUserIndex = mockUser.findIndex((user) => user.id === parsedID);
    if (findUserIndex === -1) {
        return response.status(404).send("User Not Found");
    }
    // If there are any duplicate keys between mockUser[findUserIndex] and body,
    // the value from body will overwrite the value from mockUser[findUserIndex].
    mockUser[findUserIndex] = { ...mockUser[findUserIndex], ...body};
    return response.status(201).send("Updated Successfully");
});

// delete request
app.delete('/api/users/:id' , (request,response) => {
    const { params:{id} } = request;
    const parsedID = parseInt(id);
    if (isNaN(parsedID)) {
        return response.status(400).send("Invalid ID");
    }
    const findUserIndex = mockUser.findIndex((user) => user.id === parsedID);
    if (findUserIndex === -1) {
        return response.status(404).send("User Not Found");
    }
    mockUser.splice(findUserIndex,1);
    return response.status(201).send("Deleted Successfully");
});



app.listen(PORT , () => {
    console.log(`Listening on Port http://localhost:${PORT}`);
});