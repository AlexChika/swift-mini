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
 * @returns undefined if seaarchParam is not valid else returns seaarchParam
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

// Debounce
function debounce<T extends (...args: unknown[]) => void>(
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

// Throttle
function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  ms = 50
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall > ms) {
      fn(...args);
      lastCall = now;
    }
  };
}

export * as Cookies from "./clientcookie";
export * as ColorMode from "./color-mode";
export { reloadSession } from "./reloadSession";
export { syncClock, getPageName, getParam, toRems, toEms, debounce, throttle };
