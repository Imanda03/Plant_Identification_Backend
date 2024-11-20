"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
// Middleware to verify token and check user role
const verifyToken = (roles = []) => {
    return (req, res, next) => {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return next((0, http_errors_1.default)(401, "You are not authenticated"));
            }
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err)
                    return next((0, http_errors_1.default)(403, "Token is not valid"));
                req.user = decoded;
                if (roles.length > 0) {
                    if (!roles.includes(req.user.role)) {
                        return next((0, http_errors_1.default)(403, "You do not have the required role"));
                    }
                }
                next();
            });
        }
        catch (error) {
            return next((0, http_errors_1.default)(500, "Internal server error"));
        }
    };
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map