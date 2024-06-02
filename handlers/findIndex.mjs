import { resolveIndexByUserID } from "../utils/middleware.mjs";
import { mockUser } from "../utils/constants.mjs";
import { validationResult , matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/hashPassword.mjs";

export const getUserByIdHandler =  (request, response) => {
    // console.log(request.params); log all parameters passed to routes
    const {findUserIndex} = request;
    const findUser = mockUser[findUserIndex];
    if (!findUser) {
        return response.sendStatus(404);
    }
    return response.send(findUser);
};


export const createUserHandler = async (request,response) => {
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
};
