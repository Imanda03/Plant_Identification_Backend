import { Response, Request } from "express";
import { createError } from "../../../utils/Error";
const db = require("../../../models");

const { Category } = db;

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const newCategory = await Category.create({
      title,
    });

    res.status(201).json({ message: `${title} has been created successfully` });
  } catch (error) {
    createError(res, error);
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();

    res
      .status(200)
      .json({ message: `Categories Fetched Successfully`, categories });
  } catch (error) {
    console.log("Category Error: ", error);
    res.status(500).json({ message: "Error while fetching categories" });
  }
};
