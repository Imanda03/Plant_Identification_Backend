import express from "express";

const router = express.Router();

router.use("/auth", require("./Users"));

module.exports = router;
