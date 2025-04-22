"use client";

type Cookie = {
  name: string;
  value: string;
  expDate: Date;
  path?: string;
  sameSite?: "Lax" | "Strict";
};
function setCookie(c: Cookie) {
  const { name, value, expDate, path = "/", sameSite = "Lax" } = c;

  document.cookie = `${name}=${value}; expires=${expDate}; path=${path}; SameSite=${sameSite}; Secure`;
}

function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`
    )
  );
  return matches ? matches[1] : null;
}

const set = setCookie;
const get = getCookie;

export { set, get };
