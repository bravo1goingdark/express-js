import { mockUser } from "./constants.mjs";

export const resolveIndexByUserID = (request,response,next) => {
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