import { cookies } from "next/headers";
type Theme = "light" | "dark" | undefined;

export const getServerTheme = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("swift-theme")?.value as Theme;
};
