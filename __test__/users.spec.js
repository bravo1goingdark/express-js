import { getUserByIdHandler } from "../handlers/findIndex.mjs"
import { mockUser } from "../utils/constants.mjs"
import { createUserHandler } from "../handlers/findIndex.mjs";
import validation from 'express-validator';



const mockRequest = {
    findUserIndex : 0
}
const mockResponse = {
    sendStatus : jest.fn(),
    send : jest.fn(),
    status : jest.fn(() => mockResponse)
}

jest.mock("express-validator" , () => ({
    validationResult: jest.fn(() => ({
        isEmpty : jest.fn(() => false),
        array : jest.fn(() => [{msg: "inavlid"}])
    })),
}));


describe("get users" , () => {
    it("should get users by  id" , () => {
        getUserByIdHandler(mockRequest,mockResponse);
        expect(mockResponse.send).toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(mockUser[0]);
        expect(mockResponse.send).toHaveBeenCalledTimes(1);
    });
    it("should call sendStatus with 404",() => {
        const copymockRequest = {...mockUser , findUserIndex : 100}
        getUserByIdHandler(copymockRequest,mockResponse);
        expect(mockResponse.sendStatus).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
        expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
        expect(mockResponse.send).not.toHaveBeenCalled();
    })
});

describe("create user" , () => {
    const mockRequest = {};
    it("should return status of 400 when error" , async () => {
        await createUserHandler(mockRequest,mockResponse);
        expect(validation.validationResult).toHaveBeenCalledTimes(1);
        expect(validation.validationResult).toHaveBeenCalledWith(mockRequest);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith([{msg: "inavlid"}]);
    })
})