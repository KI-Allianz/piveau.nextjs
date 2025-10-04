'use client'

import React, { createContext, useContext } from 'react';
import {LicenseEntry} from "@/lib/license";

const LicenseContext = createContext<{
  licenses: Record<string, LicenseEntry>
}>({
  licenses: {}
});

export function LicenseProvider({
                              children, licenses
                            }: {
  licenses: Record<string, LicenseEntry>;
  children: React.ReactNode;
}) {
  return (
    <LicenseContext.Provider value={{
      licenses: licenses
    }}>
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicenses() {
  const context = useContext(LicenseContext);
  if (context === null) {
    throw new Error('useLicenses must be used within an LicenseProvider');
  }

  return {
    licenses: context.licenses,
    getLicenseOrUndefined: (licenseId?: string | null) => context.licenses[licenseId || ""],
    getLicense: (license?: {
      label?: string | null
      resource?: string | null
      id?: string | null
      description?: string | null
    } | null) => context.licenses[license?.resource || ""] || {
      uri: license?.resource,
      identifier: license?.id || "unknown",
      label: license?.label || "Unknown License",
      altLabels: [],
      homepage: undefined,
      references: [],
      usageType: "",
    } as LicenseEntry
  }
}