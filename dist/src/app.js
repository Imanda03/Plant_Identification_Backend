"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import the CORS package
dotenv_1.default.config();
const db = require("../models");
const app = (0, express_1.default)();
const port = process.env.Backend_Port || 5001;
// Use CORS middleware
app.use((0, cors_1.default)()); // This will allow all origins by default
// Alternatively, you can specify options like this:
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: "GET,POST,PUT,DELETE", // Define allowed methods
    credentials: true, // If you're dealing with cookies or authentication tokens
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Express API server is listening to " + port + " and running");
});
app.use("/api", require("./Routes/router"));
db.sequelize
    .authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch((e) => console.log("Error", e));
app.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map