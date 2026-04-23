// components/HtmlSnippet.tsx
"use client"; // this must run in the browser

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

type Props = {
  html: string;
};

export default function HtmlSnippet({ html }: Props) {
  const [safeHtml, setSafeHtml] = useState("");

  useEffect(() => {
    // This code only runs in the browser, where 'window' exists
    setSafeHtml(DOMPurify.sanitize(html));
  }, [html]);

  // Return a placeholder or the raw text during SSR to avoid mismatch
  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}
