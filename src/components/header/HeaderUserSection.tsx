"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { User } from "lucide-react";

import { AUTH_DISABLED } from "@/lib/auth-config";
import { useLocale } from "@/hooks/useLocale";
import { fixThemeUrl, useTheme } from "@/hooks/useTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HeaderUserSection() {
  const { locale, translations } = useLocale();
  const session = useSession();
  const theme = useTheme();

  if (AUTH_DISABLED) return null;

  return session.status === "authenticated" ? (
    <button
      onClick={() => {
        signOut({
          callbackUrl: fixThemeUrl(`/${locale}`, theme),
        }).then();
      }}
      className="flex items-center justify-center h-full hover:text-red-500 transition-all duration-150 cursor-pointer w-full md:w-auto"
    >
      <div className="flex items-center justify-center gap-2">
        <Avatar>
          <AvatarImage src={session.data.user?.image ?? ""} alt="@shadcn" />
          <AvatarFallback>
            {session.data.user?.name
              ?.split(" ")
              .map((name) => name.at(0))
              .join("") ?? "?"}
          </AvatarFallback>
        </Avatar>
        <span className="font-bold text-[1.1rem]">
          {session.data.user?.name}
        </span>
      </div>
    </button>
  ) : (
    <button
      onClick={() => {
        signIn("keycloak", {
          callbackUrl: fixThemeUrl(`/${locale}`, theme),
        }).then();
      }}
      className="flex items-center justify-center h-full hover:text-muted-foreground transition-all duration-150 cursor-pointer w-full md:w-auto"
    >
      <div className="flex items-center justify-center gap-2">
        <Avatar>
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <span className="font-bold text-[1.1rem]">
          {translations.navigation.signIn}
        </span>
      </div>
    </button>
  );
}
