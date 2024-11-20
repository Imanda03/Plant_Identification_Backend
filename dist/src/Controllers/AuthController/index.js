"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getUserProfile = exports.login = exports.register = void 0;
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db = require("../../../models");
const { User } = db;
const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role, // Include user role here
    };
    const token = jsonwebtoken_1.default.sign(payload, "your_secret_key", { expiresIn: "1h" });
    return token;
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first");
    try {
        const { username, address, contactNumber, email, password, confirmPassword, role, } = req.body;
        const existingUser = yield User.findOne({
            where: {
                [sequelize_1.Op.or]: [{ email }],
            },
        });
        //Check existing user
        if (existingUser) {
            return res.status(403).json({
                message: "Email already registered!",
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        //Check the password
        if (password !== confirmPassword) {
            return res.status(403).json({
                password: "Password don't match!",
            });
        }
        const newUser = yield User.create({
            username,
            address,
            contactNumber,
            email,
            password: hashedPassword,
            role,
        });
        console.log("new User", newUser);
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        if (error.name === "SequelizeValidationError") {
            const validationErrors = error.errors.map((err) => ({
                field: err.path,
                message: err.message,
            }));
            return res
                .status(404)
                .json({ message: "Validation error", errors: validationErrors });
        }
        console.error("Error registering user: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = yield User.findOne({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        // Check if password matches
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Password Don't Match " });
        }
        // Sign the token with the secret
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
        // Send the response with the token
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Error logging in: ", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.login = login;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log("profile", userId);
        const userDetails = yield User.findOne({
            where: { id: userId },
        });
        return res.status(200).json({
            message: "User Details retrieved successfully.",
            userDetails,
        });
    }
    catch (error) {
        console.error("Error logging in: ", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.getUserProfile = getUserProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { username, address, contactNumber, email } = req.body;
        // Check if the user exists
        const user = yield User.findOne({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        // Update user details
        user.username = username;
        user.address = address;
        user.contactNumber = contactNumber;
        user.email = email;
        yield user.save();
        return res.status(200).json({
            message: "User profile updated successfully.",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                address: user.address,
                contactNumber: user.contactNumber,
            },
        });
    }
    catch (error) {
        console.error("Error updating user profile: ", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.updateProfile = updateProfile;
//# sourceMappingURL=index.js.map