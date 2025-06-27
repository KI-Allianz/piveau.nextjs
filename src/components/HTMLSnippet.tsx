// components/HtmlSnippet.tsx
'use client';                       // this must run in the browser

import DOMPurify from 'dompurify';

type Props = {
  html: string;
};

export default function HtmlSnippet({ html }: Props) {
  /** Sanitize first to avoid XSS */
  const safe = DOMPurify.sanitize(html);

  return <div dangerouslySetInnerHTML={{ __html: safe }} />;
}
