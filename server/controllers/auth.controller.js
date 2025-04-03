"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const handler_1 = require("../utils/handler");
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        // create a salt
        const salt = await bcrypt_1.default.genSalt(10);
        // hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const user = await user_model_1.default.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        (0, handler_1.handleCreation)(user, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            (0, handler_1.handleNotFound)(res, "User not found", next);
            return;
        }
        const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            (0, handler_1.handleNotFound)(res, "Invalid credentials", next);
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        (0, handler_1.handleSuccess)({ token, user }, res);
    }
    catch (error) {
        (0, handler_1.handleError)(error, res, next);
    }
};
exports.login = login;
