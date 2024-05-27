import express, { request, response } from 'express';
import {mockUser} from '../utils/constants.mjs';
import { body, checkSchema, matchedData, query, validationResult } from 'express-validator';
import { createPostUserValidationSchema } from '../utils/validationSchema.mjs';
const app = express();
const PORT = 3000;

// middleware for logging the request method and request url
const logMethodsAndUrl = (request,response,next) => {
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

app.get('/' ,logMethodsAndUrl, (request , response) => {
    response.send("Hello World").status(201);
});

app.get('/api/products',logMethodsAndUrl, (request, response) => {
    response.send([
        {id:1 , productName: "Pizza", cost:499},
    ]);
});

// route params
app.get('/api/users/:id',resolveIndexByUserID , (request, response) => {
    const {findUserIndex} = request;
    const findUser = mockUser[findUserIndex];
    if (!findUser) {
        return response.sendStatus(404).send("User Not Found");
    }
    return response.send(findUser);
});

// query params
// query() -> is used to validate query params
app.get('/api/user',
query("filter")
    .notEmpty().withMessage("Must not be Empty") 
    .isString().withMessage("Enter a valid value")
    .isLength({ min:8,max:12}).withMessage("Must have at least 8 character and maximum 12 character")
, (request, response) => {
    //Extracts the validation errors of an express request
    const result = validationResult(request);
    console.log(result);
    const {filter , substring} = request.query; 
    if (filter && substring) {
        const filterdUser = mockUser.filter(
            // convert mockuser username to lowercase and then compare the received substring from query params
            (user) => user[filter].toLowerCase().includes(substring.toLowerCase())
        );
        return response.send(filterdUser);
    }
    return response.send(mockUser);
});

// post request
// we can validate multiple value by passing another body() validator as middleware
// or we can pass multiple values in a single array

// app.post('/api/users',
// [body("username") 
//   .notEmpty().withMessage("Value must not be empty")
//   .isString().withMessage("Must be a String")
//   .isLength({min:5,max:32}).withMessage("must be at least 5-32 characters")
//   ,
// body("displayName")
//  .notEmpty().withMessage("Value must not be empty")
//  .isString().withMessage("Must be a String")
// ] 
// , (request,response) => {
//     const result = validationResult(request);
//     // if the error array in result is not empty i.e it means there are some errors
//     if(!result.isEmpty()){
//         return response.status(400).send(result.array());
//     }
//     // Extracts data validated or sanitized from the request, and builds an object with them.
//     const data = matchedData(request);
//     const newUser = {id:mockUser[mockUser.length-1].id+1 , ...data};
//     mockUser.push(newUser);
//     return response.status(201).send({msg:"user created succesfully", newUser});
// });


// another way to validate using checkSchema() function and passing the validation schema
app.post('/api/users',checkSchema(createPostUserValidationSchema)
, (request,response) => {
    const result = validationResult(request);
    // if the error array in result is not empty i.e it means there are some errors
    if(!result.isEmpty()){
        return response.status(400).send(result.array());
    }
    // Extracts data validated or sanitized from the request, and builds an object with them.
    const data = matchedData(request);
    const newUser = {id:mockUser[mockUser.length-1].id+1 , ...data};
    mockUser.push(newUser);
    return response.status(201).send({msg:"user created succesfully", newUser});
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