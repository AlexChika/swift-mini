import userModel from "src/models/user.model";
import { RequestHandler } from "express";

const imagesCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function getFromCache(userId: string) {
  const cached = imagesCache.get(userId);
  if (!cached) return null;

  // Check expiration
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    imagesCache.delete(userId);
    return null;
  }

  return cached.url;
}

function setInCache(userId: string, url: string) {
  imagesCache.set(userId, { url, timestamp: Date.now() });
}

const getImageController: RequestHandler = async function (req, res) {
  try {
    const userId = req.params.userId;

    const cachedUrl = getFromCache(userId);
    if (cachedUrl) {
      return res.redirect(cachedUrl);
    }

    const user = await userModel.findById(userId).select("image").lean();

    const userImage = user?.userImageUrl || user?.image;

    if (!userImage) {
      return res.status(404).send("Avatar not found");
    }

    setInCache(userId, userImage);

    res.redirect(userImage);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

function updateUserImageController() {
  // TODO
  // set userImageUrl
  // set permanentImageUrl
}

export { getImageController, updateUserImageController };
