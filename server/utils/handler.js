"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotFound = exports.handleCreation = exports.handleSuccess = exports.handleError = void 0;
// handle error
const handleError = (error, res, next) => {
    const statusCode = error.statusCode ?? 500;
    const message = error.message ?? "Something went wrong";
    console.error(error);
    if (!res.headersSent) {
        res.status(statusCode).json({ message });
    }
    next();
};
exports.handleError = handleError;
// handle success
const handleSuccess = (data, res) => {
    if (!res.headersSent) {
        res.status(200).json(data);
    }
};
exports.handleSuccess = handleSuccess;
// handle creation
const handleCreation = (data, res) => {
    if (!res.headersSent) {
        res.status(201).json(data);
    }
};
exports.handleCreation = handleCreation;
// handle not found
const handleNotFound = (res, message, next) => {
    if (!res.headersSent) {
        res.status(404).json({ message });
    }
    next();
};
exports.handleNotFound = handleNotFound;
