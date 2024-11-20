"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../../Controllers/AuthController");
const router = (0, express_1.Router)();
router.post("/login", AuthController_1.login);
router.post("/register", AuthController_1.register);
router.get("/getProfile/:userId", AuthController_1.getUserProfile);
router.put("/profile/:userId", AuthController_1.updateProfile);
module.exports = router;
//# sourceMappingURL=index.js.map