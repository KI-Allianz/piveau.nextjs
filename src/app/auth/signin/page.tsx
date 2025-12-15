"use client";

import "@/app/globals.css";
import { useEffect } from "react";
import {ThemeProvider} from "next-themes";
import {Nunito_Sans} from "next/font/google";
import {signIn} from "next-auth/react";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function SignInPage() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    signIn(
      "keycloak",
      {
        callbackUrl: searchParams.get("callbackUrl") || "/",
      }
    ).then();
  }, []);

  return (
    <html style={{ minHeight: "100vh" }}>
      <body style={{ minHeight: "100vh" }} className={`${nunitoSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-full h-svh flex flex-col items-center justify-center bg-white dark:bg-black">
            <div className="text-2xl">
              Redirecting to login…
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}