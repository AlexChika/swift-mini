/* ----------------------- C ----------------------- */
/**
 * Generates a permanent URL for a user's image.
 * @param {string} userId - The user's unique identifier.
 * @returns {string} The permanent image URL for the user.
 */
function createPermanentUrl(userId: string): string {
  return `https://server-swiftmini.globalstack.dev/images/${userId}.png`;
}

/* ----------------------- G ----------------------- */

type InviteLinkOpts = {
  encode: {
    chatId: string;
  };
  decode: {
    url: string;
  };
};

function inviteLinkEncoder(
  type: "encode",
  opts: InviteLinkOpts["encode"]
): string;
function inviteLinkEncoder(
  type: "decode",
  opts: InviteLinkOpts["decode"]
): { chatId: string; inviteId: string };
/**
 * Encodes or decodes an invite link for a chat.
 * @param {"encode" | "decode"} type - The operation type: "encode" to create a link, "decode" to extract data from a link.
 * @param {InviteLinkOpts["encode"] | InviteLinkOpts["decode"]} opts - The options for encoding or decoding.
 * @returns {string | { chatId: string; inviteId: string }} The invite link or the decoded data.
 */
function inviteLinkEncoder<T extends keyof InviteLinkOpts>(
  type: T,
  opts: InviteLinkOpts[T]
): string | { chatId: string; inviteId: string } {
  const paramsMap = {
    chatId: "swftxyjlk",
    inviteId: "swftqxzlw",
    swftqxzlw: "inviteId",
    swftxyjlk: "chatId"
  };

  if (type === "encode") {
    const id = getRandomId({ type: "alphaNumeric" });
    const { chatId } = opts as InviteLinkOpts["encode"];

    return `/invite?${paramsMap.chatId}=${chatId}&${paramsMap.inviteId}=${id}`;
  } else if (type === "decode") {
    const { url } = opts as InviteLinkOpts["decode"];
    const urlObj = new URL(url, "http://example.com");
    const chatId = urlObj.searchParams.get(paramsMap.chatId);
    const inviteId = urlObj.searchParams.get(paramsMap.inviteId);
    if (!chatId || !inviteId) {
      throw new Error("Invalid invite link");
    }
    return {
      chatId,
      inviteId
    };
  } else {
    throw new Error("Invalid type, must be 'encode' or 'decode'");
  }
}

type RandomIdOptions =
  | {
      type: "number";
      min?: number;
      max?: number;
    }
  | {
      type: "alphaNumeric";
      length?: number;
    };
/**
 * Generates a random ID as a number or alphanumeric string.
 * @param {RandomIdOptions} opts - Options for the type of ID to generate.
 *   - type: "number" for numeric ID, "alphaNumeric" for alphanumeric string.
 *   - min, max: Range for numeric ID (optional).
 *   - length: Length for alphanumeric string (optional, default 16).
 * @returns {number | string} The generated random ID.
 */
function getRandomId(opts: RandomIdOptions) {
  const type = opts.type;
  let arr: Uint8Array<ArrayBuffer>;

  if (type === "number") {
    const { min = 1, max = 1000000000000 } = opts;
    arr = new Uint8Array(8);
    crypto.getRandomValues(arr);

    let randStr = "";
    for (let i = 0; i < arr.length; i++) {
      randStr += arr[i].toString().padStart(3, "0");
    }

    const randNum = Number(randStr.slice(0, 15));
    const range = max - min + 1;

    return min + (randNum % range);
  } else if (type === "alphaNumeric") {
    const length = opts.length || 16;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    let id = "";
    for (let i = 0; i < length; i++) {
      id += chars[arr[i] % chars.length];
    }
    return id;
  }
}

/* --------------- M --------------- */

/**
 * Deep merges multiple objects into the base object.
 * @param {Record<string, object>} base - The base object to merge into.
 * @param {...Record<string, object>} items - Objects to merge into the base.
 * @returns {Record<string, object>} The merged object.
 */
function merge(
  base: Record<string, object>,
  ...items: Record<string, object>[]
): Record<string, object> {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]; //item is an object;
    const inValidInput =
      typeof item !== "object" || Array.isArray(item) || item === null;

    if (inValidInput) continue;
    Object.keys(item).forEach((key) => {
      base[key] = { ...base[key], ...item[key] };
    });
  }

  return base;
}

export { createPermanentUrl, getRandomId, inviteLinkEncoder, merge };
