import express from "express";
import { getImageController } from "./images.controller";

const imagesRouter = express.Router();

// GET /images/:userId.png
imagesRouter.get("/:userId.png", getImageController);

export default imagesRouter;
