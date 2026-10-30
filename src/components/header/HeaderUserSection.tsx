"use client";

import * as React from "react";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { Check, KeyRound, LogOut, User } from "lucide-react";

import { AUTH_DISABLED } from "@/lib/auth-config";
import { copyText } from "@/lib/clipboard";
import { useLocale } from "@/hooks/useLocale";
import { fixThemeUrl, useTheme } from "@/hooks/useTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CopyState = "idle" | "copied" | "error";

const COPY_STATE_RESET_MS = 2500;

export default function HeaderUserSection() {
  const { locale, translations } = useLocale();
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [copyState, setCopyState] = React.useState<CopyState>("idle");
  const resetTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
    };
  }, []);

  if (AUTH_DISABLED) return null;

  const showCopyState = (state: CopyState) => {
    setCopyState(state);

    if (resetTimeout.current) clearTimeout(resetTimeout.current);
    resetTimeout.current = setTimeout(
      () => setCopyState("idle"),
      COPY_STATE_RESET_MS,
    );
  };

  const handleCopyToken = async () => {
    try {
      const freshSession = await getSession();

      // A failed refresh means the Keycloak session is gone. Sign out silently
      // instead of reporting a copy failure; auth-only pages will redirect to
      // the login through their own 401 handling.
      if (freshSession?.error === "RefreshAccessTokenError") {
        await signOut({ redirect: false });
        return;
      }

      if (!freshSession?.accessToken) {
        showCopyState("error");
        return;
      }

      showCopyState(
        (await copyText(freshSession.accessToken)) ? "copied" : "error",
      );
    } catch {
      showCopyState("error");
    }
  };

  const copyTokenLabel =
    copyState === "copied"
      ? translations.navigation.tokenCopied
      : copyState === "error"
        ? translations.navigation.tokenCopyError
        : translations.navigation.copyToken;

  return status === "authenticated" ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center h-full hover:text-muted-foreground transition-all duration-150 cursor-pointer w-full md:w-auto">
          <div className="flex items-center justify-center gap-2">
            <Avatar>
              <AvatarImage src={session.user?.image ?? ""} alt="" />
              <AvatarFallback>
                {session.user?.name
                  ?.split(" ")
                  .map((name) => name.at(0))
                  .join("") ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="font-bold text-[1.1rem]">
              {session.user?.name}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{session.user?.name}</span>
            {session.user?.email && (
              <span className="text-xs text-wrap text-muted-foreground">
                {session.user.email}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            // Keep the menu open so the copy feedback stays visible.
            event.preventDefault();
            void handleCopyToken();
          }}
          className="cursor-pointer"
        >
          {copyState === "copied" ? (
            <Check className="text-green-600" />
          ) : (
            <KeyRound />
          )}
          <span aria-live="polite">{copyTokenLabel}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onSelect={() => {
            signOut({
              callbackUrl: fixThemeUrl(`/${locale}`, theme),
            }).then();
          }}
        >
          <LogOut />
          <span>{translations.navigation.signOut}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
