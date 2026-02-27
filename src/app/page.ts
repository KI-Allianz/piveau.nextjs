import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTheme } from "@/themes";

export default async function RedirectAfterLogin() {
  const headerList = await headers();
  const themeId = headerList.get("x-selected-theme");
  const theme = getTheme(themeId);
  redirect("/" + theme.lang.default);
}
