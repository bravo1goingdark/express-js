import { Router } from "express";
import { query , validationResult, matchedData , body } from "express-validator";
import { mockUser } from "../utils/constants.mjs";
import { resolveIndexByUserID } from "../utils/middleware.mjs";
const router = Router();


router.get('/api/user',
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

router.get('/api/users/:id',resolveIndexByUserID , (request, response) => {
    const {findUserIndex} = request;
    const findUser = mockUser[findUserIndex];
    if (!findUser) {
        return response.sendStatus(404).send("User Not Found");
    }
    return response.send(findUser);
});

router.post('/api/users',
[body("username") 
  .notEmpty().withMessage("Value must not be empty")
  .isString().withMessage("Must be a String")
  .isLength({min:5,max:32}).withMessage("must be at least 5-32 characters")
  ,
body("displayName")
 .notEmpty().withMessage("Value must not be empty")
 .isString().withMessage("Must be a String")
] 
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

router.put('/api/users/:id',resolveIndexByUserID , (request,response) => {
    const {body , findUserIndex} = request;
    const updatedUser = { id:mockUser[findUserIndex].id, ...body};
    mockUser[findUserIndex] = updatedUser;
    return response.status(201).send("Updated Successfully");
});

router.patch('/api/users/:id',resolveIndexByUserID , (request,response) => {
    const { body,findUserIndex } = request;
    // If there are any duplicate keys between mockUser[findUserIndex] and body,
    // the value from body will overwrite the value from mockUser[findUserIndex].
    mockUser[findUserIndex] = { ...mockUser[findUserIndex], ...body};
    return response.status(201).send("Updated Successfully");
});

// delete request
router.delete('/api/users/:id',resolveIndexByUserID , (request,response) => {
    const {findUserIndex} = request;
    mockUser.splice(findUserIndex,1);
    return response.status(201).send("Deleted Successfully");
});

export default router;