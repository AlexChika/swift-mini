// helpers here
// export { default as dateFormatter } from "./dateFormatter";

// export { default as formatUserNames } from "./formatUserNames";

async function syncClock() {
  const url = `${process.env.NEXT_PUBLIC_APP_HTTP_SERVER}/time`;

  const t0 = Date.now();
  const res = await fetch(url);
  const { serverNow } = await res.json();
  const t1 = Date.now();

  const rtt = t1 - t0;
  const delay = rtt / 2;

  const offset = serverNow + delay - t1;

  return offset;
}

/**
 *
 * @param searchParam The searchParam value from the url.
 * @returns undefined if searchParam is not valid else returns `searchParam`
 */
function getParam(searchParam: string | null) {
  const page = {
    home: "home",
    duo: "duo",
    group: "group",
    swiftAi: "swiftAi",
    settings: "settings",
    profile: "profile",
    calls: "calls",
    search: "search"
  }[searchParam || ""] as Param | undefined;
  return page;
}

/**
 *
 * @param param takes a valid param
 * @returns and returns the page name
 */
function getPageName(param: Param) {
  const pageName: Record<Param, PageName> = {
    home: "All Chats",
    duo: "Chats",
    group: "Group Chats",
    swiftAi: "Swift AI",
    settings: "Settings",
    profile: "Profile",
    calls: "Call History",
    search: "Search"
  };

  return pageName[param];
}

function toRems(...px: number[]) {
  return px.map((val) => `${val / 16}rem`).join(" ");
}

function toEms(...px: number[]) {
  return px.map((val) => `${val / 16}em`).join(" ");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  ms = 50
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= ms) {
      lastCall = now;
      return fn(...args);
    }
  };
}

function truthy<T extends string | boolean | number | symbol, A, B>(
  statefulValue: T,
  value: T,
  truthyVal: A,
  falsyVal: B
) {
  return value === statefulValue ? truthyVal : falsyVal;
}

function getSearchParam(search = "swift") {
  const url = new URL(window.location.href);
  const sp = url.searchParams;
  return getParam(sp.get(search)) || "home";
}

type TransformOptions = {
  width?: number;
  height?: number;
  radius?: number | "max";
  crop?: string;
  quality?: string | number;
  format?: string;
  effect?: string;
  gravity?: string;
  other?: string; // for advanced/custom transforms
};

interface GetCloudinaryUrlParams {
  publicId: string;
  folder?: string;
  format?: string;
  options?: TransformOptions;
}

function getCloudinaryUrl({
  publicId,
  folder,
  format = "jpg",
  options = {}
}: GetCloudinaryUrlParams): string {
  const cloudName = process.env.NEXT_PUBLIC_CD_NAME;

  // Default transformations for thumbnails, avatars, etc.
  const defaultOptions: TransformOptions = {
    crop: "fill",
    radius: "max", // makes avatars circular
    format: "auto", // let Cloudinary pick best format
    quality: "auto" // smart compression
  };

  // Merge options with defaults (user overrides)
  const config: TransformOptions = { ...defaultOptions, ...options };

  // compose transformation string dynamically
  const transformParts: string[] = [];

  if (config.width) transformParts.push(`w_${config.width}`);
  if (config.height) transformParts.push(`h_${config.height}`);
  if (config.crop) transformParts.push(`c_${config.crop}`);
  if (config.radius) transformParts.push(`r_${config.radius}`);
  if (config.quality) transformParts.push(`q_${config.quality}`);
  if (config.format) transformParts.push(`f_${config.format}`);
  if (config.effect) transformParts.push(`e_${config.effect}`);
  if (config.gravity) transformParts.push(`g_${config.gravity}`);
  if (config.other) transformParts.push(config.other);

  const transform = transformParts.join(",");

  const folderPath = folder ? `${folder}/` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${folderPath}${publicId}.${format}`;
}

type RandomIdOptions =
  | { type: "number"; min?: number; max?: number }
  | { type: "alphaNumeric"; length?: number };

function getRandomId(opts: {
  type: "number";
  min?: number;
  max?: number;
}): number;
function getRandomId(opts: { type: "alphaNumeric"; length?: number }): string;
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
  } else {
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

export * as Cookies from "./clientcookie";
export * as ColorMode from "./color-mode";
export { reloadSession } from "./reloadSession";
export {
  syncClock,
  getPageName,
  getParam,
  toRems,
  toEms,
  debounce,
  throttle,
  truthy,
  getSearchParam,
  getCloudinaryUrl,
  getRandomId
};
