import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import the CORS package

dotenv.config();

const db = require("../models");

const app: Express = express();

const port = process.env.Backend_Port || 5001;

// Use CORS middleware
app.use(cors()); // This will allow all origins by default
// Alternatively, you can specify options like this:
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: "GET,POST,PUT,DELETE", // Define allowed methods
    credentials: true, // If you're dealing with cookies or authentication tokens
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
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
