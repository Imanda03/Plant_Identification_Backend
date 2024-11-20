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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.addCategory = void 0;
const Error_1 = require("../../../utils/Error");
const db = require("../../../models");
const { Category } = db;
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        const newCategory = yield Category.create({
            title,
        });
        res.status(201).json({ message: `${title} has been created successfully` });
    }
    catch (error) {
        (0, Error_1.createError)(res, error);
    }
});
exports.addCategory = addCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category.findAll();
        res
            .status(200)
            .json({ message: `Categories Fetched Successfully`, categories });
    }
    catch (error) {
        console.log("Category Error: ", error);
        res.status(500).json({ message: "Error while fetching categories" });
    }
});
exports.getCategories = getCategories;
//# sourceMappingURL=index.js.map