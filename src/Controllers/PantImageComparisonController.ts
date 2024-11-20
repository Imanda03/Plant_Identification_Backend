import * as tf from "@tensorflow/tfjs-node";
import * as mobilenet from "@tensorflow-models/mobilenet";
import axios from "axios";

const db = require("../../models");
const { PlantData } = db;

class PlantImageComparisonController {
  private model: mobilenet.MobileNet | null = null;

  constructor() {
    this.initModel();
  }

  private async initModel(): Promise<void> {
    if (!this.model) {
      this.model = await mobilenet.load();
    }
  }

  private async downloadImage(url: string): Promise<Buffer> {
    const response = await axios({
      url,
      responseType: "arraybuffer",
    });
    return response.data;
  }

  private async extractFeatures(imageBuffer: Buffer): Promise<tf.Tensor> {
    if (!this.model) {
      await this.initModel();
    }

    const tfImage = tf.node.decodeImage(imageBuffer, 3);
    const resized = tf.image.resizeBilinear(tfImage, [224, 224]);
    const normalized = resized.div(tf.scalar(255.0));
    const batched = normalized.expandDims(0);

    const features = this.model.infer(batched, true);

    // Dispose of temporary tensors
    tfImage.dispose();
    resized.dispose();
    normalized.dispose();
    batched.dispose();

    return features;
  }

  async findMostAccuratePlant(
    inputImageUrl: string,
    accuracyThreshold: number = 0.6
  ) {
    try {
      // Download input image
      const inputImageBuffer = await this.downloadImage(inputImageUrl);
      const inputFeatures = await this.extractFeatures(inputImageBuffer);

      // Find all plants
      const allPlants = await PlantData.findAll({
        attributes: ["id", "name", "imageUrl", "description", "category"],
      });

      const plantComparisons = await Promise.all(
        allPlants.map(async (plant) => {
          try {
            // Download comparison image
            const comparisonBuffer = await this.downloadImage(plant.imageUrl);
            const comparisonFeatures = await this.extractFeatures(
              comparisonBuffer
            );

            // Calculate cosine similarity
            const norm1 = tf.norm(inputFeatures);
            const norm2 = tf.norm(comparisonFeatures);
            const dotProduct = tf.sum(
              tf.mul(inputFeatures, comparisonFeatures)
            );

            const similarityScore = await dotProduct
              .div(norm1.mul(norm2))
              .data();

            // Cleanup features
            comparisonFeatures.dispose();

            return {
              plant: plant.dataValues,
              similarity: similarityScore[0],
            };
          } catch (error) {
            console.error(`Error processing plant ${plant.id}:`, error);
            return null;
          }
        })
      );

      // Cleanup input features
      inputFeatures.dispose();

      // Filter and sort comparisons
      const validComparisons = plantComparisons
        .filter(
          (comparison) =>
            comparison !== null && comparison.similarity >= accuracyThreshold
        )
        .sort((a, b) => b.similarity - a.similarity);

      // Return the most accurate plant
      const topMatch = validComparisons[0];
      return topMatch
        ? {
            ...topMatch.plant,
            accuracyScore: topMatch.similarity,
          }
        : null;
    } catch (error) {
      console.error("Image comparison error:", error);
      throw error;
    }
  }
}

export = new PlantImageComparisonController();
