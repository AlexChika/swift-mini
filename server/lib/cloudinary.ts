import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { CLOUDINARY_URL } from "./utils/constants";

type DATA = {
  secure_url: string;
  public_id: string;
  asset_id: string;
  resource_type: string;
};

async function uploadToCloudinary(
  base64String: string,
  publicId?: string,
  folder?: string
) {
  const apiKey = process.env.CD_KEY;
  const apiSecret = process.env.CD_SEC;

  try {
    if (!apiKey || !apiSecret)
      throw new Error("Cloudinary credentials not found");

    const timestamp = Math.round(Date.now() / 1000);

    const params: Record<string, unknown> = {
      timestamp,
      overwrite: true
    };

    if (publicId) params.public_id = publicId;
    if (folder) params.folder = folder;

    // Create the signature string (params sorted alphabetically + api_secret)
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const signature = crypto
      .createHash("sha1")
      .update(`${sortedParams}${apiSecret}`)
      .digest("hex");

    // Construct form data
    const formData = new URLSearchParams();
    formData.append("file", base64String);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("overwrite", "true");
    if (publicId) formData.append("public_id", publicId);
    if (folder) formData.append("folder", folder);

    const response = await axios.post<DATA>(CLOUDINARY_URL, formData);

    return {
      success: true as const,
      msg: "success",
      data: {
        url: response.data.secure_url,
        publicId: response.data.public_id,
        assetId: response.data.asset_id,
        resourceType: response.data.resource_type
      }
    };
  } catch (e) {
    const err = e as AxiosError<{ error: { message: string } }>;

    console.error(err.response || err);

    return {
      success: false as const,
      msg:
        err.response?.data?.error?.message ||
        err.message ||
        err.response?.statusText ||
        "Something went wrong",
      data: null
    };
  }
}

type Params = {
  publicId: string;
  folder: string;
  format?: string;
  options?: {
    width?: number;
    height?: number;
    radius?: number;
  };
};

function getCloudinaryUrl(opts: Params) {
  const { publicId, folder, format = "jpg", options = {} } = opts;

  const cloudName = process.env.CD_NAME;
  const { width, height, radius } = options;

  const tokens: string[] = [];
  if (typeof width === "number") tokens.push(`w_${width}`);
  if (typeof height === "number") tokens.push(`h_${height}`);
  if (typeof radius === "number") tokens.push(`r_${radius}`);

  const transform = tokens.length ? `${tokens.join(",")}/` : "";

  // remove leading or trailing slashe
  const cleanFolder = folder ? folder.replace(/^\/+|\/+$/g, "") + "/" : "";

  const encodedPublicId = encodeURIComponent(publicId);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}${cleanFolder}${encodedPublicId}.${format}`;
}

export { uploadToCloudinary, getCloudinaryUrl };
