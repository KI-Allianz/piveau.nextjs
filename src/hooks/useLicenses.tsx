"use client";

import React, { createContext, useContext } from "react";
import type { LicenseEntry } from "@/lib/license";
import { normalizeLicenseKey } from "@/lib/license-key";

const LicenseContext = createContext<{
  licenses: Record<string, LicenseEntry>;
}>({
  licenses: {},
});

export function LicenseProvider({
  children,
  licenses,
}: {
  licenses: Record<string, LicenseEntry>;
  children: React.ReactNode;
}) {
  return (
    <LicenseContext.Provider
      value={{
        licenses: licenses,
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicenses() {
  const context = useContext(LicenseContext);
  if (context === null) {
    throw new Error("useLicenses must be used within an LicenseProvider");
  }

  return {
    licenses: context.licenses,
    getLicenseOrUndefined: (licenseId?: string | null) =>
      context.licenses[normalizeLicenseKey(licenseId)],
    getLicense: (
      license?: {
        label?: string | null;
        resource?: string | null;
        id?: string | null;
        description?: string | null;
      } | null,
    ) =>
      context.licenses[normalizeLicenseKey(license?.resource || license?.id)] ||
      ({
        uri: license?.resource || license?.id,
        identifier: license?.id || "unknown",
        label: license?.label || "Unknown License",
        altLabels: [],
        homepage: undefined,
        references: [],
        usageType: "",
      } as LicenseEntry),
  };
}
