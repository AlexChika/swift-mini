import { cookies } from "next/headers";
type Theme = "light" | "dark";

export const getServerTheme = async (defaultTheme: Theme) => {
  const cookieStore = await cookies();
  return (cookieStore.get("theme")?.value || defaultTheme) as Theme;
};
