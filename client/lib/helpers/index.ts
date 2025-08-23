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

export * as Cookies from "./clientcookie";
export * as ColorMode from "./color-mode";
export { reloadSession } from "./reloadSession";
export { syncClock };
