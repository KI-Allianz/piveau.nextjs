import {redirect} from "next/navigation";
import {defaultLocale} from "@/lib/lang";


export default async function RedirectAfterLogin() {
  redirect("/" + defaultLocale)
}