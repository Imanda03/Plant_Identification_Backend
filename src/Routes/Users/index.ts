import { Router } from "express";
import {
  getUserProfile,
  login,
  register,
  updateProfile,
} from "../../Controllers/AuthController";
import { verifyToken } from "../../../utils/verifyToken";
const PlantImageComparisonController = require("../../Controllers/PantImageComparisonController");

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getProfile/:userId", getUserProfile);
router.put("/profile/:userId", updateProfile);

router.post("/compare-image", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const strictlyAccuratePlant =
      await PlantImageComparisonController.findMostAccuratePlant(imageUrl, 0.6);

    console.log("strictlyAccuratePlant", strictlyAccuratePlant);
    res.json(strictlyAccuratePlant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.post("/add-plant", async (req, res) => {
//   try {
//     const { name, imageUrl } = req.body;
//     const newPlant = await PlantImageComparisonController.addPlantImage(
//       name,
//       imageUrl
//     );
//     res.status(201).json(newPlant);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
